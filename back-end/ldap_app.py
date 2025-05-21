# back-end/app.py
from abc import ABC, abstractmethod
import logging
import os
from typing import Dict
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import jwt
import json
import pymysql
import secrets
from ldap3 import Server, Connection, ALL
from datetime import datetime, timedelta
from email_sender import send_verification_email

app = Flask(__name__, static_folder="./front-end/out", static_url_path="")
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


class ValidationStrategy(ABC):

    @abstractmethod
    def validate(self, actual_value: dict) -> bool:
        pass


class DefaultValidation(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        return False


class 화면보호기_사용(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        return (
            str(actual_value.get("screenSaverEnabled")) == "1"
            and int(actual_value.get("screenSaverTime", 0)) >= 600
            and str(actual_value.get("screenSaverSecure")) == "1"
        )


class 사용자_계정명의_적정성(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        computer_name = actual_value.get("computer_name")
        user_name = actual_value.get("computer_name")

        return str(computer_name) == str(user_name)


class 불필요한_계정_사용(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        actual_folders = actual_value.get("accounts", [])
        username = actual_value.get("user_name")
        required_folders = [
            "Administrator",
            "DefaultAccount",
            "Guest",
            "WDAGUtilityAccount",
            username,
        ]
        return set(actual_folders) == set(required_folders)


class 패스워드_길이의_적정성(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        return int(actual_value.get("minimumPasswordLength", 0)) >= 8


class 패스워드_복잡도_설정(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        return int(actual_value.get("passwordComplexity")) == 1


class 패스워드_주기적_변경(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        return int(actual_value.get("maximumPasswordAge", 0)) >= 90


class 동일_패스워드_설정_제한(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        return int(actual_value.get("passwordHistorySize")) >= 5


class 공유폴더_확인(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        actual_folders = actual_value.get("folders", [])
        required_folders = ["IPC$"]
        return set(actual_folders) == set(required_folders)


class 불분명_프린터_확인(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        actual_folders = actual_value.get("printers", [])
        required_folders = [
            "Sindoh uPrint Driver",
            "OneNote 2013으로 보내기",
            "Microsoft XPS Document Writer",
            "Microsoft Print to PDF",
        ]
        return set(actual_folders) == set(required_folders)


class 원격데스크톱_제한(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        return str(actual_value.get("fDenyTSConnections")) == "1"


class 불특정_소프트웨어_확인(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        min_office_version = "15.0.5589.1001"
        min_ahnlab_version = "1.13.0.1914"

        office_valid = False
        ahnlab_valid = False

        for component in actual_value:
            name = component.get("Name", "")
            version = component.get("Version", "0.0.0.0")

            if "Office 16" in name and version >= min_office_version:
                office_valid = True

            if "AhnLab Safe Transaction" in name and version >= min_ahnlab_version:
                ahnlab_valid = True

        return office_valid and ahnlab_valid


class OS_패치_확인(ValidationStrategy):
    # Define supported Windows versions, build numbers, and support end dates
    supported_versions = [
        {
            "version": "Windows 10",
            "build": "20H2",
            "build_number": 19042,
            "end_date": datetime(2022, 5, 11),
        },
        {
            "version": "Windows 10",
            "build": "21H1",
            "build_number": 19043,
            "end_date": datetime(2022, 12, 14),
        },
        {
            "version": "Windows 10",
            "build": "21H2",
            "build_number": 19044,
            "end_date": datetime(2023, 6, 14),
        },
        {
            "version": "Windows 10",
            "build": "22H2",
            "build_number": 19045,
            "end_date": datetime(2025, 10, 15),
        },
        {
            "version": "Windows 11",
            "build": "22H2",
            "build_number": 22621,
            "end_date": datetime(2025, 10, 15),
        },
        {
            "version": "Windows 11",
            "build": "23H2",
            "build_number": 22631,
            "end_date": datetime(2026, 11, 11),
        },
        {
            "version": "Windows 11",
            "build": "24H2",
            "build_number": 26100,
            "end_date": datetime(2027, 10, 13),
        },
    ]

    def validate(self, actual_value: dict) -> bool:
        windows_version = actual_value.get("windowsVersion", "")
        build_number = int(actual_value.get("windowsBuildNumber", 0))

        current_date = datetime.now()

        for entry in self.supported_versions:
            if (
                entry["version"] in windows_version
                and build_number == entry["build_number"]
            ):
                return current_date <= entry["end_date"]

        # If no match is found, return False
        return False


VALIDATION_STRATEGIES: Dict[str, ValidationStrategy] = {
    "화면보호기 사용": 화면보호기_사용(),
    "사용자 계정명의 적정성": 사용자_계정명의_적정성(),
    "불필요한 계정 사용": 불필요한_계정_사용(),
    "패스워드 길이의 적정성": 패스워드_길이의_적정성(),
    "패스워드 복잡도 설정": 패스워드_복잡도_설정(),
    "패스워드 주기적 변경": 패스워드_주기적_변경(),
    "동일 패스워드 설정 제한": 동일_패스워드_설정_제한(),
    "공유폴더 확인": 공유폴더_확인(),
    "불분명 프린터 확인": 불분명_프린터_확인(),
    "원격데스크톱 제한": 원격데스크톱_제한(),
    "소프트웨어 패치 관리": DefaultValidation(),
    "불특정 소프트웨어 확인": 불특정_소프트웨어_확인(),
    "OS 패치 확인": OS_패치_확인(),
}


def get_db_connection():
    return pymysql.connect(**DB_CONFIG)


@app.route("/api/validate_check", methods=["POST"])
def validate_check():
    """
    항목 검증을 배치 스크립트에서 바로 실행할 수 있는 API 엔드포인트
    클라이언트로부터 받은 item_type과 actual_value를 검증하고 결과를 반환
    """
    data = request.json
    print(data)
    if (
        not data
        or "user_id" not in data
        or "item_type" not in data
        or "actual_value" not in data
    ):
        error_message = "필수 필드가 누락되었습니다 (user_id, item_type, actual_value)"
        print(f"[ERROR] {error_message}")
        return jsonify({"error": error_message}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 체크리스트 항목 조회
        cur.execute(
            """
            SELECT item_id, item_name
            FROM checklist_items
            WHERE item_name LIKE %s
            """,
            (data["item_type"],),
        )
        item_result = cur.fetchone()

        if not item_result:
            error_message = f"[{data['item_type']}] 체크리스트 항목을 찾을 수 없습니다"
            print(f"{error_message}")
            return jsonify({"error": error_message}), 404

        user_id = data["user_id"]
        item_id = item_result["item_id"]
        item_name = item_result["item_name"]
        actual_value = data["actual_value"]  # 이미 JSON 객체
        notes = data.get("notes", "")

        # 검증 로직
        passed = None  # 기본값

        # 예외 목록에 없는 경우만 검증
        EXCEPTION_ITEM_NAMES = [
            "정보자산 물리적 보호조치",
            "인증수단 기밀성 유지",
            "무선AP 확인",
            "정밀검사 이력",
            "실시간 감시",
            "백신 업데이트",
            "개인정보 파일의 암호화 저장",
            "개인정보 보유의 적정성",
            "고유 식별번호 처리 제한",
        ]

        print(type(item_name), type(passed), type(actual_value))

        if item_name not in EXCEPTION_ITEM_NAMES:
            # 적절한 전략 선택
            strategy = VALIDATION_STRATEGIES.get(item_name, DefaultValidation())
            passed = 1 if strategy.validate(actual_value) else 0

            # 검증 결과에 따라 자동으로 notes 생성
            if notes == "":  # 사용자가 notes를 직접 제공하지 않은 경우에만 자동 생성
                notes = generate_notes(item_name, passed, actual_value)

        # JSON 문자열로 변환
        actual_value_json = json.dumps(actual_value, ensure_ascii=False)

        print(user_id, item_id, actual_value_json, passed, notes)

        # 로그 저장 또는 업데이트
        cur.execute(
            """
            INSERT INTO audit_log (user_id, item_id, actual_value, passed, notes)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (user_id, item_id, actual_value_json, passed, notes),
        )

        conn.commit()
        return jsonify(
            {
                "status": "success",
                "item_id": item_id,
                "item_name": item_name,
                "passed": passed,
            }
        )

    except Exception as e:
        conn.rollback()
        error_message = str(e)
        print(f"[ERROR 500] {error_message}")
        return jsonify({"status": "failed", "message": error_message}), 500

    finally:
        conn.close()


def generate_notes(item_name, passed, actual_value):
    """
    검증 결과에 따라 자동으로 notes를 생성하는 함수
    """
    if passed == 1:
        # 통과한 경우의 메시지
        notes_success = {
            "화면보호기 사용": "화면 보호기가 정상적으로 설정되어 있습니다.",
            "사용자 계정명의 적정성": "사용자 계정명이 적절하게 설정되어 있습니다.",
            "불필요한 계정 사용": "불필요한 계정이 없습니다.",
            "패스워드 길이의 적정성": "암호 길이가 정책에 맞게 설정되어 있습니다.",
            "패스워드 복잡도 설정": "암호 복잡도가 적절하게 설정되어 있습니다.",
            "패스워드 주기적 변경": "암호 변경 주기가 적절하게 설정되어 있습니다.",
            "동일 패스워드 설정 제한": "동일 암호 사용 제한이 적절하게 설정되어 있습니다.",
            "공유폴더 확인": "불필요한 공유 폴더가 없습니다.",
            "불분명 프린터 확인": "인가되지 않은 프린터가 없습니다.",
            "원격데스크톱 제한": "원격 데스크톱이 적절하게 제한되어 있습니다.",
            "불특정 소프트웨어 확인": "모든 소프트웨어가 최신 버전으로 업데이트되어 있습니다.",
            "OS 패치 확인": "운영체제가 최신 상태로 업데이트되어 있습니다.",
        }
        return notes_success.get(item_name, "검사 항목이 정상적으로 확인되었습니다.")
    else:
        # 실패한 경우의 메시지
        notes_failure = {
            "화면보호기 사용": f"화면 보호기 설정이 정책에 맞지 않습니다. 현재 설정: 활성화={actual_value.get('screenSaverEnabled')}, 시간={actual_value.get('screenSaverTime')}초, 암호설정={actual_value.get('screenSaverSecure')}. 화면 보호기 활성화 및 10분(600초) 이내 설정, 재시작 시 암호 필요 옵션을 켜주세요.",
            "사용자 계정명의 적정성": f"사용자 계정명({actual_value.get('computer_name')})이 지정된 이름({actual_value.get('user_name')})과 일치하지 않습니다. 계정명을 수정해주세요.",
            "불필요한 계정 사용": "불필요한 계정이 발견되었습니다. 필요하지 않은 계정을 비활성화하거나 제거해주세요.",
            "패스워드 길이의 적정성": f"암호 길이가 정책(8자 이상)에 맞지 않습니다. 현재 설정: {actual_value.get('minimumPasswordLength')}자. 암호 길이를 8자 이상으로 설정해주세요.",
            "패스워드 복잡도 설정": "암호 복잡도가 설정되어 있지 않습니다. 암호 복잡도 설정을 활성화해주세요.",
            "패스워드 주기적 변경": f"암호 변경 주기가 정책(90일 이내)에 맞지 않습니다. 현재 설정: {actual_value.get('maximumPasswordAge')}일. 90일 이내로 설정해주세요.",
            "동일 패스워드 설정 제한": f"동일 암호 사용 제한이 정책(5회 이상)에 맞지 않습니다. 현재 설정: {actual_value.get('passwordHistorySize')}회. 5회 이상으로 설정해주세요.",
            "공유폴더 확인": "불필요한 공유 폴더가 있습니다. 필요하지 않은 공유 폴더를 제거해주세요.",
            "불분명 프린터 확인": "인가되지 않은 프린터가 있습니다. 불필요한 프린터를 제거해주세요.",
            "원격데스크톱 제한": "원격 데스크톱이 활성화되어 있습니다. 보안을 위해 비활성화해주세요.",
            "불특정 소프트웨어 확인": "일부 소프트웨어가 최신 버전이 아닙니다. 소프트웨어를 업데이트해주세요.",
            "OS 패치 확인": f"운영체제({actual_value.get('windowsVersion')}, 빌드:{actual_value.get('windowsBuildNumber')})가 최신 상태가 아닙니다. 윈도우 업데이트를 실행하여 최신 상태로 유지해주세요.",
        }
        return notes_failure.get(
            item_name, "검사 항목이 정책에 맞지 않습니다. 확인이 필요합니다."
        )


@app.route("/api/authenticate", methods=["POST"])
def authenticate():
    data = request.json
    print(data)
    # if not data or "username" not in data or "emp_id" not in data:
    #     return jsonify({"error": "Invalid request"}), 400
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT user_id
            FROM users
            WHERE username = %s
            """,
            (data["username"]),
        )
        user = cur.fetchone()
        if user:
            return jsonify({"user_id": user["user_id"]})
        else:
            return jsonify(
                {
                    "status": "failed",
                    "message": "사용자 검증에 실패했습니다. 운영실에 문의해주세요.",
                    "statusCode": 401,
                }
            )
    finally:
        if conn:
            conn.close()


# 로그 저장 경로 설정
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)


@app.route("/api/log", methods=["POST"])
def receive_log():
    try:
        data = request.get_json()
        client_ip = request.remote_addr
        # 필수 필드 검증
        required_fields = ["timestamp", "level", "message"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "필수 필드가 누락되었습니다"}), 400
        # # 로그 저장
        log_file = f"{LOG_DIR}/{datetime.now().strftime('%Y-%m-%d')}.log"
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(
                f"[{data['timestamp']}] [{client_ip}] [{data['level']}] {data['message']}\n"
            )
        # 로그 레벨에 따른 처리
        if data["level"] == "FAIL":
            logging.error(data["message"])
        elif data["level"] == "PASS":
            logging.info(data["message"])
        else:
            logging.info(data["message"])
        return jsonify({"status": "연결 성공"}), 200
    except Exception as e:
        logging.error(f"로그 처리 오류: {str(e)}")
        return jsonify({"error": "로그 처리 중 오류 발생"}), 500


# API 라우트 처리 (필요한 경우)
@app.route("/api/<path:path>", methods=["GET", "POST", "PUT", "DELETE"])
def handle_api(path):
    # API 로직 구현
    return {"message": f"API 응답: {path}"}


# 정적 파일 먼저 확인
@app.route("/<path:path>")
def serve_static(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path) and not os.path.isdir(file_path):
        return send_from_directory(app.static_folder, path)
    return serve_index()  # 파일이 없으면 index.html로 폴백


# Next.js 페이지 라우트를 위한 폴백 - 모든 클라이언트 사이드 라우팅 지원
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>/")
def serve_index(path=""):
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
