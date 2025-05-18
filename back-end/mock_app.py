# back-end/mock_app.py (ldap_app.py의 테스트 버전)
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import json
import pymysql
import secrets
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(
    app, resources={
        r"/api/*": {
            'origins': ['http://localhost:3000', "http://10.106.25.129:3000"],
            'supports_credentials': True
        }
    }, allow_headers=["Content-Type", "Authorization"], expose_headers=["Content-Type", "Authorization"], max_age=600)

# 사용자 환경 설정
JWT_SECRET = "your-secret-key"
TOKEN_EXPIRATION = 28800  # 8시간 (초 단위)

# 인증 코드 저장소 (실제 환경에서는 Redis나 DB 사용 권장)
verification_codes = {}

# 테스트 사용자 데이터
TEST_USERS = {
    "admin": {
        "password": "admin123",
        "name": "관리자",
        "email": "admin@example.com",
        "dept": "IT보안팀"
    },
    "user1": {
        "password": "user123",
        "name": "일반사용자",
        "email": "user1@example.com",
        "dept": "개발팀"
    },
    "tester": {
        "password": "test123",
        "name": "테스트계정",
        "email": "test@example.com",
        "dept": "품질관리팀"
    }
}

# 모의 LDAP 인증 (테스트용)
def authenticate_ldap(username, password):
    # 테스트 사용자가 존재하고 비밀번호가 일치하는지 확인
    if username in TEST_USERS and TEST_USERS[username]["password"] == password:
        user_data = TEST_USERS[username]
        return {
            "success": True,
            "username": username,
            "email": user_data["email"],
            "name": user_data["name"],
            "dept": user_data["dept"],
        }
    else:
        return {
            "success": False,
            "message": "아이디 또는 비밀번호가 올바르지 않습니다.",
        }


# API 엔드포인트: 자격증명 확인
@app.route("/api/auth/check-credentials", methods=["POST"])
def check_credentials():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    # 모의 LDAP 인증
    result = authenticate_ldap(username, password)

    if result["success"]:
        # 성공 시 사용자 이메일 반환
        return jsonify({"success": True, "email": result["email"]})
    else:
        # 실패 시 오류 메시지 반환
        return jsonify(result), 401


# API 엔드포인트: 이메일 인증 코드 발송 (모의)
@app.route("/api/auth/email-verification", methods=["POST"])
def send_verification():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"success": False, "message": "이메일 주소가 필요합니다."}), 400

    # 6자리 인증 코드 생성
    verification_code = "123456"  # 테스트용 고정 코드

    # 인증 코드 저장 (15분 유효)
    expiry = datetime.now() + timedelta(minutes=15)
    verification_codes[email] = {"code": verification_code, "expiry": expiry}

    # 콘솔에 출력 (실제 이메일 발송 대신)
    print(f"이메일 인증 코드: {verification_code} (수신자: {email})")
    
    return jsonify({"success": True, "message": "인증 코드가 발송되었습니다."})


# API 엔드포인트: 인증 코드 확인 및 로그인
@app.route("/api/auth/verify-and-login", methods=["POST"])
def verify_and_login():
    data = request.json
    email = data.get("email")
    code = data.get("code")
    username = data.get("username")
    password = data.get("password")
    
    # 테스트 모드: 모든 코드 허용 (123456 또는 DB에 저장된 코드)
    is_valid_code = code == "123456"
    
    # 저장된 코드가 있으면 확인
    if email in verification_codes:
        verification_info = verification_codes[email]
        is_valid_code = is_valid_code or (verification_info["code"] == code and datetime.now() <= verification_info["expiry"])

    if not is_valid_code:
        return jsonify({"success": False, "message": "인증 코드가 일치하지 않거나 만료되었습니다."}), 400

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
    if email in verification_codes:
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
        return jsonify({
            "authenticated": True,
            "username": payload["username"],
            "name": payload.get("name", "사용자"),
            "dept": payload.get("dept", "부서없음"),
        })
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


# 모의 보안 데이터 생성
MOCK_SECURITY_DATA = {
    "stats": {
        "lastAuditDate": datetime.now().strftime("%Y-%m-%d"),
        "totalChecks": 20,
        "completedChecks": 15,
        "criticalIssues": 5
    },
    "logs": [
        {
            "log_id": 1,
            "user_id": 1,
            "item_id": 1,
            "actual_value": {"setting": "enabled", "value": "1"},
            "passed": 1,
            "notes": "방화벽이 정상적으로 활성화되어 있습니다.",
            "checked_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        },
        {
            "log_id": 2,
            "user_id": 1,
            "item_id": 2,
            "actual_value": {"setting": "disabled", "value": "0"},
            "passed": 0,
            "notes": "백신이 비활성화되어 있습니다. 즉시 활성화하세요.",
            "checked_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        },
        {
            "log_id": 3,
            "user_id": 1,
            "item_id": 3,
            "actual_value": {"setting": "enabled", "value": "1"},
            "passed": 1,
            "notes": "OS 업데이트가 최신 상태입니다.",
            "checked_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    ],
    "checklist_items": [
        {
            "item_id": 1,
            "name": "방화벽 활성화 확인",
            "category": "시스템 보안",
            "description": "Windows 방화벽이 활성화되어 있는지 확인합니다."
        },
        {
            "item_id": 2,
            "name": "백신 프로그램 활성화 확인",
            "category": "바이러스 보안",
            "description": "백신 프로그램이 설치되어 활성화되어 있는지 확인합니다."
        },
        {
            "item_id": 3,
            "name": "OS 업데이트 확인",
            "category": "시스템 보안",
            "description": "운영체제가 최신 업데이트 상태인지 확인합니다."
        },
        {
            "item_id": 4,
            "name": "화면 잠금 설정 확인",
            "category": "계정 보안",
            "description": "일정 시간 후 화면 잠금이 활성화되는지 확인합니다."
        },
        {
            "item_id": 5,
            "name": "비밀번호 복잡성 확인",
            "category": "계정 보안",
            "description": "비밀번호 정책이 복잡성 요구사항을 충족하는지 확인합니다."
        }
    ]
}


# API 엔드포인트: 사용자별 보안 통계 데이터 조회 (모의)
@app.route("/api/security-audit/stats", methods=["GET"])
def get_security_stats():
    token = request.cookies.get('auth_token')

    if not token:
        return jsonify({'message': '인증 토큰이 필요합니다.'}), 401

    try:
        # 토큰 검증 (간단히)
        jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        
        # 모의 데이터 반환
        return jsonify(MOCK_SECURITY_DATA["stats"])

    except Exception as e:
        print(f"Error in get_security_stats: {str(e)}")
        return jsonify({"error": str(e)}), 500


# API 엔드포인트: 사용자별 보안 감사 로그 목록 조회 (모의)
@app.route("/api/security-audit/logs", methods=["GET"])
def get_audit_logs():
    token = request.cookies.get('auth_token')

    if not token:
        return jsonify({'message': '인증 토큰이 필요합니다.'}), 401

    try:
        # 토큰 검증 (간단히)
        jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        
        # 모의 데이터 반환
        return jsonify(MOCK_SECURITY_DATA["logs"])

    except Exception as e:
        print(f"Error in get_audit_logs: {str(e)}")
        return jsonify({"error": str(e)}), 500


# API 엔드포인트: 사용자별 체크리스트 항목 조회 (모의)
@app.route("/api/security-audit/checklist-items", methods=["GET"])
def get_checklist_items():
    try:
        # 모의 데이터 반환
        return jsonify(MOCK_SECURITY_DATA["checklist_items"])

    except Exception as e:
        print(f"Error in get_checklist_items: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("============================================================")
    print("   모의 로그인 테스트 서버가 시작되었습니다!")
    print("============================================================")
    print("테스트 계정 정보:")
    for username, info in TEST_USERS.items():
        print(f"- 사용자명: {username}, 비밀번호: {info['password']}, 이름: {info['name']}")
    print("============================================================")
    print("* 모든 인증 코드는 '123456'으로 설정되어 있습니다.")
    print("* 서버 주소: http://localhost:5001")
    print("============================================================")
    
    app.run(host="0.0.0.0", port=5001, debug=True)