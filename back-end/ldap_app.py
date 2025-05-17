# back-end/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import json
import pymysql
import secrets
from ldap3 import Server, Connection, ALL
from datetime import datetime, timedelta
from email_sender import send_verification_email

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "http://10.106.25.129:3000"],
            "supports_credentials": True,
        }
    },
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["Content-Type", "Authorization"],
    max_age=600,
)

# 사용자 환경 설정
LDAP_SERVER = "ldap://your-ldap-server.com"
LDAP_PORT = 389
LDAP_BASE_DN = "ou=users,dc=ldapAdmin,dc=example,dc=com"
JWT_SECRET = "your-secret-key"
TOKEN_EXPIRATION = 28800  # 8시간 (초 단위)

# 인증 코드 저장소 (실제 환경에서는 Redis나 DB 사용 권장)
verification_codes = {}


# LDAP 연결 및 사용자 검증
def authenticate_ldap(username, password):
    server = Server(LDAP_SERVER, port=LDAP_PORT, get_info=ALL)
    user_dn = f"uid={username},{LDAP_BASE_DN}"

    try:
        # LDAP 연결 시도
        connection = Connection(server, user=user_dn, password=password, auto_bind=True)
        if connection.bind():
            # 사용자 정보 검색
            search_filter = f"(uid={username})"
            connection.search(
                LDAP_BASE_DN,
                search_filter,
                attributes=["uid", "cn", "sn", "ou", "mail", "displayName"],
            )

            if connection.entries:
                user_data = connection.entries[0]

                # 사용자 정보 반환 (이메일, 이름 등)
                return {
                    "success": True,
                    "username": username,
                    "email": (
                        user_data.mail.value if hasattr(user_data, "mail") else None
                    ),
                    "name": (user_data.cn.value if hasattr(user_data, "cn") else None),
                    "dept": (user_data.ou.value if hasattr(user_data, "ou") else None),
                }

        return {
            "success": False,
            "message": "아이디 또는 비밀번호가 올바르지 않습니다.",
        }
    except Exception as e:
        print(f"LDAP 인증 중 오류: {str(e)}")
        return {"success": False, "message": "서버 연결 중 오류가 발생했습니다."}


# API 엔드포인트: 자격증명 확인
@app.route("/api/auth/check-credentials", methods=["POST"])
def check_credentials():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    # LDAP 인증
    result = authenticate_ldap(username, password)

    if result["success"]:
        # 성공 시 사용자 이메일 반환
        return jsonify(
            {"success": True, "email": result["email"] or f"{username}@example.com"}
        )
    else:
        # 실패 시 오류 메시지 반환
        return jsonify(result), 401


# API 엔드포인트: 이메일 인증 코드 발송
@app.route("/api/auth/email-verification", methods=["POST"])
def send_verification():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"success": False, "message": "이메일 주소가 필요합니다."}), 400

    # 6자리 인증 코드 생성
    verification_code = "".join(secrets.choice("0123456789") for _ in range(6))

    # 인증 코드 저장 (15분 유효)
    expiry = datetime.now() + timedelta(minutes=15)
    verification_codes[email] = {"code": verification_code, "expiry": expiry}

    # 이메일 발송 (외부 모듈 구현)
    try:
        send_verification_email(email, verification_code)
        return jsonify({"success": True, "message": "인증 코드가 발송되었습니다."})
    except Exception as e:
        print(f"이메일 발송 중 오류: {str(e)}")
        return (
            jsonify(
                {"success": False, "message": "인증 코드 발송 중 오류가 발생했습니다."}
            ),
            500,
        )


# API 엔드포인트: 인증 코드 확인 및 로그인
@app.route("/api/auth/verify-and-login", methods=["POST"])
def verify_and_login():
    data = request.json
    email = data.get("email")
    code = data.get("code")
    username = data.get("username")
    password = data.get("password")

    # 인증 코드 확인
    if email not in verification_codes:
        return (
            jsonify({"success": False, "message": "유효하지 않은 인증 정보입니다."}),
            400,
        )

    verification_info = verification_codes[email]

    # 코드 만료 확인
    if datetime.now() > verification_info["expiry"]:
        # 만료된 코드 삭제
        del verification_codes[email]
        return (
            jsonify({"success": False, "message": "인증 코드가 만료되었습니다."}),
            400,
        )

    # 코드 일치 확인
    if verification_info["code"] != code:
        return (
            jsonify({"success": False, "message": "인증 코드가 일치하지 않습니다."}),
            400,
        )

    # 다시 LDAP 인증 (보안 강화)
    result = authenticate_ldap(username, password)

    if not result["success"]:
        return jsonify(result), 401

    # 인증 성공 시 JWT 토큰 생성
    token_payload = {
        "username": username,
        "name": result.get("name"),
        "dept": result.get("dept"),
        "exp": datetime.now() + timedelta(seconds=TOKEN_EXPIRATION),
    }

    token = jwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

    # 인증 코드 삭제 (사용 완료)
    del verification_codes[email]

    # 토큰 반환
    response = jsonify({"success": True, "message": "로그인 성공"})
    response.set_cookie(
        "auth_token",
        token,
        httponly=True,
        max_age=TOKEN_EXPIRATION,
        samesite="Lax",
        domain=None,
        path="/",
    )

    return response


# API 엔드포인트: 사용자 정보 조회
@app.route("/api/auth/me", methods=["GET"])
def get_user_info():
    token = request.cookies.get("auth_token")

    if not token:
        return jsonify({"message": "인증 토큰이 필요합니다."}), 401

    try:
        # 토큰 검증
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

        # 사용자 정보 반환
        return jsonify(
            {
                "authenticated": True,
                "username": payload["username"],
                "name": payload.get("name", payload["name"]),
                "dept": payload.get("dept", payload["dept"]),
            }
        )
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "토큰이 만료되었습니다."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "유효하지 않은 토큰입니다."}), 401
    except Exception as e:
        print(f"사용자 정보 조회 중 오류: {str(e)}")
        return jsonify({"message": "서버 오류가 발생했습니다."}), 500


# 로그아웃 엔드포인트
@app.route("/api/auth/logout", methods=["POST"])
def logout():
    response = jsonify({"success": True, "message": "로그아웃 성공"})
    response.delete_cookie("auth_token")
    return response


# 사용자 환경 설정
DB_CONFIG = {
    "host": "localhost",
    "port": 33060,
    "user": "root",
    "password": "dnb123!!",
    "db": "patch_management",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor,  # 딕셔너리 커서 사용
}


def get_db_connection():
    return pymysql.connect(**DB_CONFIG)


# API 엔드포인트: 사용자별 보안 통계 데이터 조회
@app.route("/api/security-audit/stats", methods=["GET"])
def get_security_stats():
    token = request.cookies.get("auth_token")

    if not token:
        return jsonify({"message": "인증 토큰이 필요합니다."}), 401

    try:
        # 토큰 검증
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

        # 토큰에서 사용자 가져오기
        user_name = payload.get("username")

        if not user_name:
            return jsonify({"message": "사용자 정보를 찾을 수 없습니다."}), 401

        conn = get_db_connection()
        with conn.cursor() as cursor:

            # 사용자 ID 가져오기
            cursor.execute(
                """
                SELECT id
                FROM users2
                WHERE uid = %s
                """,
                (user_name,),
            )

            user = cursor.fetchone()

            user_id = user["id"]

            # 총 체크리스트 항목 수 조회
            cursor.execute(
                """
                SELECT COUNT(*) as total_items
                FROM checklist_items
                """
            )
            total_items_result = cursor.fetchone()
            total_checks = total_items_result["total_items"]

            # 해당 사용자의 가장 최근 감사 날짜 조회
            cursor.execute(
                """
                SELECT MAX(checked_at) as last_audit_date
                FROM audit_log
                WHERE user_id = %s
                """,
                (user_id,),
            )
            last_audit_result = cursor.fetchone()
            last_audit_date = last_audit_result["last_audit_date"]

            # 해당 사용자가 통과한 검사 항목 수 조회
            cursor.execute(
                """
                SELECT COUNT(DISTINCT item_id) as completed_checks
                FROM audit_log
                WHERE passed = 1 AND user_id = %s
                """,
                (user_id,),
            )
            passed_checks_result = cursor.fetchone()
            completed_checks = passed_checks_result["completed_checks"]

            # 해당 사용자의 심각한 문제(통과하지 못한 항목) 수 조회
            cursor.execute(
                """
                SELECT COUNT(DISTINCT item_id) as critical_issues
                FROM audit_log
                WHERE passed = 0 AND user_id = %s
                """,
                (user_id,),
            )
            failed_checks_result = cursor.fetchone()
            critical_issues = failed_checks_result["critical_issues"]

        conn.close()

        # 날짜 포맷 변환
        formatted_date = last_audit_date.strftime("%Y-%m-%d") if last_audit_date else ""

        # 응답 데이터 구성
        stats = {
            "lastAuditDate": formatted_date,
            "totalChecks": total_checks,
            "completedChecks": completed_checks,
            "criticalIssues": critical_issues,
        }

        return jsonify(stats)

    except Exception as e:
        print(f"Error in get_security_stats: {str(e)}")
        return jsonify({"error": str(e)}), 500


# API 엔드포인트: 사용자별 보안 감사 로그 목록 조회 (수정됨)
@app.route("/api/security-audit/logs", methods=["GET"])
def get_audit_logs():
    token = request.cookies.get("auth_token")

    if not token:
        return jsonify({"message": "인증 토큰이 필요합니다."}), 401

    try:
        # 토큰 검증
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

        # 토큰에서 사용자 가져오기
        user_name = payload.get("username")

        if not user_name:
            return jsonify({"message": "사용자 정보를 찾을 수 없습니다."}), 401

        conn = get_db_connection()
        with conn.cursor() as cursor:

            # 사용자 ID 가져오기
            cursor.execute(
                """
                SELECT id
                FROM users2
                WHERE uid = %s
                """,
                (user_name,),
            )

            user = cursor.fetchone()

            user_id = user["id"]

            # 특정 사용자의 로그만 날짜 역순으로 가져오기
            cursor.execute(
                """
                SELECT log_id, user_id, item_id, actual_value, passed, notes, checked_at
                FROM audit_log
                WHERE user_id = %s
                ORDER BY checked_at DESC
            """,
                (user_id,),
            )

            logs = cursor.fetchall()
        conn.close()

        result = []
        for log in logs:
            # MariaDB의 JSON 타입이 자동으로 파싱되지 않을 수 있으므로 확인
            if isinstance(log["actual_value"], str):
                actual_value = json.loads(log["actual_value"])
            else:
                actual_value = log["actual_value"]

            # checked_at이 datetime 객체라면 문자열로 변환
            if isinstance(log["checked_at"], datetime):
                checked_at = log["checked_at"].strftime("%Y-%m-%d %H:%M:%S")
            else:
                checked_at = log["checked_at"]

            result.append(
                {
                    "log_id": log["log_id"],
                    "user_id": log["user_id"],
                    "item_id": log["item_id"],
                    "actual_value": actual_value,
                    "passed": log["passed"],
                    "notes": log["notes"],
                    "checked_at": checked_at,
                }
            )

        return jsonify(result)

    except Exception as e:
        print(f"Error in get_audit_logs: {str(e)}")
        return jsonify({"error": str(e)}), 500


# API 엔드포인트: 사용자별 체크리스트 항목 조회
@app.route("/api/security-audit/checklist-items", methods=["GET"])
def get_checklist_items():
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # 모든 체크리스트 항목 가져오기 (사용자별 필터링이 필요없는 경우)
            cursor.execute(
                """
                SELECT item_id, category, item_name as name, description
                FROM checklist_items
                ORDER BY item_id ASC
            """
            )

            items = cursor.fetchall()
        conn.close()

        return jsonify(items)

    except Exception as e:
        print(f"Error in get_checklist_items: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
