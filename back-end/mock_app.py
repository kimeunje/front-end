# back-end/mock_app.py (ldap_app.py의 테스트 버전)
from abc import ABC, abstractmethod
import io
import logging
import os
from typing import Dict
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import jwt
import json
import pymysql
import secrets
from datetime import datetime, timedelta

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

# 로깅 설정
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("server.log", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)

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
        "dept": "IT보안팀",
    },
    "user1": {
        "password": "user123",
        "name": "일반사용자",
        "email": "user1@example.com",
        "dept": "개발팀",
    },
    "kimeunje": {
        "password": "test123",
        "name": "테스트계정",
        "email": "test@example.com",
        "dept": "품질관리팀",
    },
    "hamtori": {
        "password": "hamtori123",
        "name": "햄토리",
        "email": "test@example.com",
        "dept": "품질관리팀",
    },
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
        is_valid_code = is_valid_code or (
            verification_info["code"] == code
            and datetime.now() <= verification_info["expiry"]
        )

    if not is_valid_code:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "인증 코드가 일치하지 않거나 만료되었습니다.",
                }
            ),
            400,
        )

    # 다시 LDAP 인증 (보안 강화)
    result = authenticate_ldap(username, password)

    print(result)
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

    print(token)

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
    print(token)
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
                "name": payload.get("name", "사용자"),
                "dept": payload.get("dept", "부서없음"),
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


# 모의 보안 데이터 생성
MOCK_SECURITY_DATA = {
    "stats": {
        "lastAuditDate": datetime.now().strftime("%Y-%m-%d"),
        "totalChecks": 20,
        "completedChecks": 15,
        "criticalIssues": 5,
    },
    "logs": [
        {
            "log_id": 1,
            "user_id": 1,
            "item_id": 1,
            "actual_value": {"setting": "enabled", "value": "1"},
            "passed": 1,
            "notes": "방화벽이 정상적으로 활성화되어 있습니다.",
            "checked_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
        {
            "log_id": 2,
            "user_id": 1,
            "item_id": 2,
            "actual_value": {"setting": "disabled", "value": "0"},
            "passed": 0,
            "notes": "백신이 비활성화되어 있습니다. 즉시 활성화하세요.",
            "checked_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
        {
            "log_id": 3,
            "user_id": 1,
            "item_id": 3,
            "actual_value": {"setting": "enabled", "value": "1"},
            "passed": 1,
            "notes": "OS 업데이트가 최신 상태입니다.",
            "checked_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
        {
            "log_id": 528,
            "user_id": 1,
            "item_id": 5,
            "actual_value": {
                "user_name": "새이름",
                "accounts": [
                    "Administrator",
                    "DefaultAccount",
                    "Guest",
                    "WDAGUtilityAccount",
                    "새이름",
                ],
            },
            "passed": 0,
            "notes": "불필요한 계정이 발견되었습니다. 필요하지 않은 계정을 비활성화하거나 제거해주세요.",
            "checked_at": "2025-05-19 10:55:16",
        },
        {
            "log_id": 528,
            "user_id": 1,
            "item_id": 5,
            "actual_value": {
                "user_name": "새이름",
                "accounts": [
                    "Administrator",
                    "DefaultAccount",
                    "Guest",
                    "WDAGUtilityAccount",
                    "새이름",
                ],
            },
            "passed": 1,
            "notes": "불필요한 계정이 없습니다.",
            "checked_at": "2025-05-19 10:55:16",
        },
    ],
    "checklist_items": [
        {
            "item_id": 1,
            "name": "방화벽 활성화 확인",
            "category": "시스템 보안",
            "description": "Windows 방화벽이 활성화되어 있는지 확인합니다.",
        },
        {
            "item_id": 2,
            "name": "백신 프로그램 활성화 확인",
            "category": "바이러스 보안",
            "description": "백신 프로그램이 설치되어 활성화되어 있는지 확인합니다.",
        },
        {
            "item_id": 3,
            "name": "OS 업데이트 확인",
            "category": "시스템 보안",
            "description": "운영체제가 최신 업데이트 상태인지 확인합니다.",
        },
        {
            "item_id": 4,
            "name": "화면 잠금 설정 확인",
            "category": "계정 보안",
            "description": "일정 시간 후 화면 잠금이 활성화되는지 확인합니다.",
        },
        {
            "item_id": 5,
            "name": "비밀번호 복잡성 확인",
            "category": "계정 보안",
            "description": "비밀번호 정책이 복잡성 요구사항을 충족하는지 확인합니다.",
        },
    ],
}

# API 엔드포인트: 사용자별 보안 통계 데이터 조회 (모의)
# @app.route("/api/security-audit/stats", methods=["GET"])
# def get_security_stats():
#     token = request.cookies.get("auth_token")

#     if not token:
#         return jsonify({"message": "인증 토큰이 필요합니다."}), 401

#     try:
#         # 토큰 검증 (간단히)
#         jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

#         # 모의 데이터 반환
#         return jsonify(MOCK_SECURITY_DATA["stats"])


#     except Exception as e:
#         print(f"Error in get_security_stats: {str(e)}")
#         return jsonify({"error": str(e)}), 500
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
        print(user_name)
        if not user_name:
            return jsonify({"message": "사용자 정보를 찾을 수 없습니다."}), 401

        conn = get_db_connection()
        with conn.cursor() as cursor:

            # 사용자 ID 가져오기
            cursor.execute(
                """
                SELECT uid
                FROM users
                WHERE user_id = %s
                """,
                (user_name,),
            )

            user = cursor.fetchone()
            user_id = user["uid"]

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


# API 엔드포인트: 사용자별 보안 감사 로그 목록 조회 (모의)
# @app.route("/api/security-audit/logs", methods=["GET"])
# def get_audit_logs():
#     token = request.cookies.get('auth_token')

#     if not token:
#         return jsonify({'message': '인증 토큰이 필요합니다.'}), 401

#     try:
#         # 토큰 검증 (간단히)
#         jwt.decode(token, JWT_SECRET, algorithms=['HS256'])

#         # 모의 데이터 반환
#         return jsonify(MOCK_SECURITY_DATA["logs"])

#     except Exception as e:
#         print(f"Error in get_audit_logs: {str(e)}")
#         return jsonify({"error": str(e)}), 500


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
        print(user_name)
        if not user_name:
            return jsonify({"message": "사용자 정보를 찾을 수 없습니다."}), 401

        conn = get_db_connection()
        with conn.cursor() as cursor:

            # 사용자 ID 가져오기
            cursor.execute(
                """
                SELECT uid
                FROM users
                WHERE user_id = %s
                """,
                (user_name,),
            )

            user = cursor.fetchone()
            user_id = user["uid"]

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


# API 엔드포인트: 사용자별 체크리스트 항목 조회 (모의)
# @app.route("/api/security-audit/checklist-items", methods=["GET"])
# def get_checklist_items():
#     try:
#         # 모의 데이터 반환
#         return jsonify(MOCK_SECURITY_DATA["checklist_items"])


#     except Exception as e:
#         print(f"Error in get_checklist_items: {str(e)}")
#         return jsonify({"error": str(e)}), 500
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


# log.py에 추가할 새로운 API 엔드포인트

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


class 방화벽_활성화_확인(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        # 필수 방화벽 프로필 목록
        required_profiles = ["Domain", "Private", "Public"]

        # 모든 필수 프로필이 존재하고 활성화(값이 1)되어 있는지 확인
        for profile in required_profiles:
            # 프로필이 없거나 비활성화(0)되어 있으면 검증 실패
            if profile not in actual_value or actual_value.get(profile) != 1:
                return False

        return True


class 백신_상태_확인(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        # 백신 정보 직접 확인
        display_name = actual_value.get("DisplayName", "")
        up_to_date = actual_value.get("UpToDate", 0)
        real_time_protection = actual_value.get("RealTimeProtection", 0)

        # 백신이 설치되지 않은 경우
        if "미설치" in display_name:
            return False

        # 알약 관련 제품인지 확인 (알약, AhnLab, V3 등)
        is_ahnlab_product = any(
            name in display_name for name in ["알약", "AhnLab", "V3"]
        )

        # 알약 제품이 아니라면 검증 실패
        if not is_ahnlab_product:
            return False

        # 실시간 보호 및 업데이트 상태 확인
        # 참고: 변경된 데이터에서는 0/1 또는 False/True로 값이 제공됨
        if not real_time_protection:
            return False

        if not up_to_date:
            return False

        # 모든 조건이 통과되었으므로 검증 성공
        return True


class 이동매체_자동실행_제한(ValidationStrategy):

    def validate(self, actual_value: dict) -> bool:
        # NoDriveTypeAutoRun 값이 255 또는 95인 경우만 통과
        value = actual_value.get("Value")

        # 값이 문자열로 전달될 경우 정수로 변환 시도
        if isinstance(value, str) and value.isdigit():
            value = int(value)

        # 값이 정수인지 확인하고 검증
        if isinstance(value, int):
            return value >= 255 or value == 95

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
    "방화벽 활성화 확인": 방화벽_활성화_확인(),
    "원격데스크톱 제한": 원격데스크톱_제한(),
    "소프트웨어 패치 관리": DefaultValidation(),
    "불특정 소프트웨어 확인": 불특정_소프트웨어_확인(),
    "이동매체 자동실행 제한": 이동매체_자동실행_제한(),
    "OS 패치 확인": OS_패치_확인(),
    "백신 상태 확인": 백신_상태_확인(),
}


def get_db_connection():
    return pymysql.connect(**DB_CONFIG)


# validate_check 함수도 간단하게 수정 - 이제 항상 UPDATE만 수행
@app.route("/api/validate_check", methods=["POST"])
def validate_check():
    """
    항목 검증 API - 이제 기존 로그를 업데이트만 함
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
        actual_value = data["actual_value"]
        notes = data.get("notes", "")

        # 검증 로직
        passed = None

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

        if item_name not in EXCEPTION_ITEM_NAMES:
            # 적절한 전략 선택
            strategy = VALIDATION_STRATEGIES.get(item_name, DefaultValidation())
            passed = 1 if strategy.validate(actual_value) else 0

            # 검증 결과에 따라 자동으로 notes 생성
            if notes == "":
                notes = generate_notes(item_name, passed, actual_value)

        # JSON 문자열로 변환
        actual_value_json = json.dumps(actual_value, ensure_ascii=False)

        # 오늘 날짜의 해당 항목 로그를 찾아서 업데이트
        cur.execute(
            """
            SELECT log_id 
            FROM audit_log 
            WHERE user_id = %s AND item_id = %s AND DATE(checked_at) = DATE(NOW())
            ORDER BY checked_at DESC
            LIMIT 1
            """,
            (user_id, item_id),
        )

        existing_log = cur.fetchone()

        if existing_log:
            # 기존 로그 업데이트
            cur.execute(
                """
                UPDATE audit_log 
                SET actual_value = %s, passed = %s, notes = %s, checked_at = NOW()
                WHERE log_id = %s
                """,
                (actual_value_json, passed, notes, existing_log["log_id"]),
            )
            log_action = "updated"
        else:
            # 만약 기존 로그가 없으면 새로 생성 (예외 상황)
            print(
                f"[WARNING] 기존 로그가 없어 새로 생성합니다: user_id={user_id}, item_id={item_id}"
            )
            cur.execute(
                """
                INSERT INTO audit_log (user_id, item_id, actual_value, passed, notes)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (user_id, item_id, actual_value_json, passed, notes),
            )
            log_action = "created"

        conn.commit()
        return jsonify(
            {
                "status": "success",
                "item_id": item_id,
                "item_name": item_name,
                "passed": passed,
                "log_action": log_action,
            }
        )

    except Exception as e:
        if conn:
            conn.rollback()
        error_message = str(e)
        print(f"[ERROR 500] {error_message}")
        return jsonify({"status": "failed", "message": error_message}), 500

    finally:
        if conn:
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
            "방화벽 활성화 확인": "모든 방화벽 프로필(Domain, Private, Public)이 정상적으로 활성화되어 있습니다.",
            "공유폴더 확인": "불필요한 공유 폴더가 없습니다.",
            "불분명 프린터 확인": "인가되지 않은 프린터가 없습니다.",
            "": "알약 백신이 정상적으로 설치되어 있으며, 실시간 보호 및 최신 업데이트가 적용되어 있습니다.",
            "원격데스크톱 제한": "원격 데스크톱이 적절하게 제한되어 있습니다.",
            "이동매체 자동실행 제한": "이동식 미디어 자동실행이 올바르게 제한되어 있습니다.",
            "불특정 소프트웨어 확인": "모든 소프트웨어가 최신 버전으로 업데이트되어 있습니다.",
            "OS 패치 확인": "운영체제가 최신 상태로 업데이트되어 있습니다.",
        }
        return notes_success.get(item_name, "검사 항목이 정상적으로 확인되었습니다.")
    else:
        # 비활성화된 프로필 목록 생성
        if item_name == "방화벽 활성화 확인":
            disabled_profiles = []
            for profile in ["Domain", "Private", "Public"]:
                if profile not in actual_value or actual_value.get(profile) != 1:
                    disabled_profiles.append(profile)

            if disabled_profiles:
                disabled_str = ", ".join(disabled_profiles)
                return f"일부 방화벽 프로필({disabled_str})이 비활성화되어 있습니다. 모든 프로필(Domain, Private, Public)을 활성화해주세요."

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
            "방화벽 활성화 확인": "일부 방화벽 프로필이 비활성화되어 있습니다. 모든 프로필(Domain, Private, Public)을 활성화해주세요.",
            "불분명 프린터 확인": "인가되지 않은 프린터가 있습니다. 불필요한 프린터를 제거해주세요.",
            "원격데스크톱 제한": "원격 데스크톱이 활성화되어 있습니다. 보안을 위해 비활성화해주세요.",
            "이동매체 자동실행 제한": f"이동식 미디어 자동실행이 제한되어 있지 않습니다. 현재 값: {actual_value.get('Value', '없음')}. 레지스트리 설정(NoDriveTypeAutoRun)을 255 또는 95로 설정하여 자동실행을 제한해주세요.",
            "불특정 소프트웨어 확인": "일부 소프트웨어가 최신 버전이 아닙니다. 소프트웨어를 업데이트해주세요.",
            "백신 상태 확인": "알약 백신이 정상적으로 설치되어 있지 않거나, 실시간 보호가 비활성화되어 있거나, 업데이트가 최신 상태가 아닙니다. 알약 백신을 설치하고 실시간 보호를 활성화한 후 최신 업데이트를 적용해주세요.",
            "OS 패치 확인": f"운영체제({actual_value.get('windowsVersion')}, 빌드:{actual_value.get('windowsBuildNumber')})가 최신 상태가 아닙니다. 윈도우 업데이트를 실행하여 최신 상태로 유지해주세요.",
        }
        return notes_failure.get(
            item_name, "검사 항목이 정책에 맞지 않습니다. 확인이 필요합니다."
        )


@app.route("/api/authenticate", methods=["POST"])
def authenticate():
    data = request.json
    print(data)

    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 사용자 확인
        cur.execute(
            """
            SELECT uid
            FROM users
            WHERE username = %s
            """,
            (data["username"]),
        )
        user = cur.fetchone()

        if not user:
            return jsonify(
                {
                    "status": "failed",
                    "message": "사용자 검증에 실패했습니다. 운영실에 문의해주세요.",
                    "statusCode": 401,
                }
            )

        user_id = user["uid"]

        # 오늘 날짜의 감사 로그가 이미 있는지 확인
        cur.execute(
            """
            SELECT COUNT(*) as log_count
            FROM audit_log
            WHERE user_id = %s AND DATE(checked_at) = DATE(NOW())
            """,
            (user_id,),
        )

        existing_logs = cur.fetchone()["log_count"]

        # 오늘 감사 로그가 없으면 모든 체크리스트 항목에 대해 기본 로그 생성
        if existing_logs == 0:
            # 모든 체크리스트 항목 조회
            cur.execute(
                """
                SELECT item_id, item_name, category, description
                FROM checklist_items
                ORDER BY item_id
                """
            )

            checklist_items = cur.fetchall()

            # 각 항목에 대해 기본 감사 로그 생성
            for item in checklist_items:
                default_actual_value = json.dumps(
                    {"status": "pending", "message": "검사 대기 중"}, ensure_ascii=False
                )

                cur.execute(
                    """
                    INSERT INTO audit_log (user_id, item_id, actual_value, passed, notes, checked_at)
                    VALUES (%s, %s, %s, 0, '검사 대기 중', NOW())
                    """,
                    (user_id, item["item_id"], default_actual_value),
                )

            conn.commit()
            print(
                f"사용자 {data['username']} ({user_id})에 대해 {len(checklist_items)}개의 감사 로그를 생성했습니다."
            )
        else:
            print(
                f"사용자 {data['username']} ({user_id})의 오늘 감사 로그가 이미 존재합니다. ({existing_logs}개)"
            )

        return jsonify({"user_id": user_id})

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"사용자 검증 오류: {str(e)}")
        return jsonify(
            {
                "status": "failed",
                "message": "서버 오류가 발생했습니다.",
                "statusCode": 500,
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

        # 메모리에서 파일 생성
        file_data = io.BytesIO()
        file_data.write(
            bat_content.encode("cp949")
        )  # Windows 배치 파일은 CP949 인코딩 사용
        file_data.seek(0)

        # 파일 다운로드 응답
        return send_file(
            file_data,
            as_attachment=True,
            download_name="abbbb.bat",
            mimetype="application/octet-stream",
        )

    except Exception as e:
        app.logger.error(f"BAT 파일 다운로드 오류: {str(e)}")
        return jsonify({"error": "파일 다운로드 중 오류가 발생했습니다."}), 500


# # API 라우트 처리 (필요한 경우)
# @app.route("/api/<path:path>", methods=["GET", "POST", "PUT", "DELETE"])
# def handle_api(path):
#     # API 로직 구현
#     return {"message": f"API 응답: {path}"}

# # 정적 파일 먼저 확인
# @app.route("/<path:path>")
# def serve_static(path):
#     file_path = os.path.join(app.static_folder, path)
#     if os.path.exists(file_path) and not os.path.isdir(file_path):
#         return send_from_directory(app.static_folder, path)
#     return serve_index()  # 파일이 없으면 index.html로 폴백

# # Next.js 페이지 라우트를 위한 폴백 - 모든 클라이언트 사이드 라우팅 지원
# @app.route("/", defaults={"path": ""})
# @app.route("/<path:path>/")
# def serve_index(path=""):
#     return send_from_directory(app.static_folder, "index.html")

# mock_app.py의 라우팅 부분을 완전히 교체

# mock_app.py에서 기존 라우팅 부분을 모두 제거하고 다음으로 교체

import mimetypes
from werkzeug.exceptions import NotFound

# MIME 타입 설정
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")


# 디버깅을 위한 요청 로깅
@app.before_request
def log_request():
    app.logger.info(
        f"Request: {request.method} {request.path} - User-Agent: {request.headers.get('User-Agent', 'Unknown')}"
    )


# 정적 리소스 처리 (_next, favicon 등)
@app.route("/_next/<path:path>")
def serve_next_static(path):
    """Next.js 정적 리소스 (_next 폴더)"""
    try:
        return send_from_directory(os.path.join(app.static_folder, "_next"), path)
    except NotFound:
        app.logger.error(f"Static file not found: _next/{path}")
        return "File not found", 404


@app.route("/favicon.ico")
def favicon():
    try:
        return send_from_directory(app.static_folder, "favicon.ico")
    except:
        return "", 204


# 확장자가 있는 정적 파일 처리
@app.route("/<path:filename>")
def serve_static_file(filename):
    """확장자가 있는 파일들 (css, js, png, etc.)"""
    # 확장자가 있는 경우만 정적 파일로 처리
    if "." in filename and not filename.endswith("/"):
        try:
            file_path = os.path.join(app.static_folder, filename)
            if os.path.exists(file_path) and os.path.isfile(file_path):
                return send_from_directory(app.static_folder, filename)
        except Exception as e:
            app.logger.error(f"Error serving static file {filename}: {e}")

    # 정적 파일이 아니면 SPA 라우팅으로 처리
    return serve_spa()


# Next.js SPA 라우팅 처리
def serve_spa():
    """Next.js SPA 앱 서빙"""
    try:
        # 먼저 특정 경로의 HTML 파일이 있는지 확인
        request_path = request.path.strip("/")

        # 경로별 HTML 파일 확인
        possible_paths = [
            f"{request_path}.html",
            f"{request_path}/index.html",
            "index.html",
        ]

        for path in possible_paths:
            full_path = os.path.join(app.static_folder, path)
            if os.path.exists(full_path) and os.path.isfile(full_path):
                app.logger.info(
                    f"Serving HTML file: {path} for request: {request.path}"
                )
                return send_from_directory(app.static_folder, path)

        # 기본 index.html 반환
        app.logger.info(f"Serving default index.html for request: {request.path}")
        return send_from_directory(app.static_folder, "index.html")

    except Exception as e:
        app.logger.error(f"Error serving SPA for {request.path}: {e}")
        return "Application Error", 500


# 루트 경로
@app.route("/")
def serve_root():
    return serve_spa()


# 모든 Next.js 라우트 처리
@app.route("/<path:path>")
def serve_spa_routes(path):
    """모든 Next.js 클라이언트 사이드 라우트"""
    # API 요청은 이미 위에서 처리됨
    return serve_spa()


# 404 에러 핸들러
@app.errorhandler(404)
def not_found_handler(error):
    """404 에러 처리"""
    # API 요청인 경우
    if request.path.startswith("/api/"):
        return jsonify({"error": "API endpoint not found", "path": request.path}), 404

    # 그 외의 경우 Next.js 앱으로 라우팅
    app.logger.info(f"404 handler redirecting to SPA for: {request.path}")
    return serve_spa()


# 500 에러 핸들러
@app.errorhandler(500)
def internal_error_handler(error):
    """500 에러 처리"""
    app.logger.error(f"Internal server error: {error}")
    if request.path.startswith("/api/"):
        return jsonify({"error": "Internal server error"}), 500
    return serve_spa()


if __name__ == "__main__":
    print("============================================================")
    print("   모의 로그인 테스트 서버가 시작되었습니다!")
    print("============================================================")
    print("테스트 계정 정보:")
    for username, info in TEST_USERS.items():
        print(
            f"- 사용자명: {username}, 비밀번호: {info['password']}, 이름: {info['name']}"
        )
    print("============================================================")
    print("* 모든 인증 코드는 '123456'으로 설정되어 있습니다.")
    print("* 서버 주소: http://localhost:5000")
    print("============================================================")

    app.run(host="0.0.0.0", port=5000, debug=True)
