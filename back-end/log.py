import uuid
from flask import Flask, json, render_template, request, jsonify, send_file
import logging
from datetime import datetime
import mariadb
import pymysql  # MariaDB 연결을 위한 라이브러리
import os
from abc import ABC, abstractmethod
from typing import Dict
from flask_cors import CORS
import mariadb.cursors
import pymysql.cursors

app = Flask(__name__)

CORS(app)

# 로깅 설정
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("server.log", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)

DB_CONFIG = {
    "host": "localhost",
    "port": 33060,
    "user": "root",
    "password": "dnb123!!",
    "database": "patch_management",
}

DB_CONFIG2 = {
    "host": "localhost",
    "port": 33060,
    "user": "root",
    "password": "dnb123!!",
    "db": "patch_management",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor,  # 딕셔너리 커서 사용
}


def get_db_connection():
    conn = mariadb.connect(**DB_CONFIG)
    conn.autocommit = False
    # 결과를 딕셔너리로 받기 위한 설정
    return conn


def get_item_name(item_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT item_name
            FROM checklist_items
            WHERE item_id = ?
            """,
            (item_id,),
        )
        result = cur.fetchone()
        if not result:
            return jsonify({"error": "로그를 찾을 수 없습니다"}), 404
        item_name = result[0]
        conn.commit()
        return item_name
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


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


@app.route("/api/authenticate", methods=["POST"])
def authenticate():
    data = request.json
    if not data or "username" not in data or "emp_id" not in data:
        return jsonify({"error": "Invalid request"}), 400
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT user_id, username, emp_id
            FROM users
            WHERE username = ? AND emp_id = ?
            """,
            (data["username"], data["emp_id"]),
        )
        user = cur.fetchone()
        if user:
            return jsonify({"user_id": user[0], "emp_id": user[2]})
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


@app.route("/api/generate_logs", methods=["POST"])
def generate_logs():
    user_id = request.json["user_id"]
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        # 사용자 로그 생성 여부 확인
        cur.execute("SELECT log_generated FROM users WHERE user_id = ?", (user_id,))
        log_generated = cur.fetchone()[0]
        if log_generated:
            return jsonify({"status": "already_generated"}), 200
        # 모든 checklist_items 항목을 가져옵니다.
        cur.execute("SELECT item_id, item_name FROM checklist_items")
        items = cur.fetchall()
        # 각 항목을 audit_log 테이블에 삽입 또는 업데이트합니다.
        for item in items:
            item_id, item_name = item
            cur.execute(
                """
                INSERT INTO audit_log (user_id, item_id, actual_value, notes)
                VALUES (?, ?, '{}', '자동 생성')
                ON DUPLICATE KEY UPDATE
                actual_value = '{}',
                notes = '자동 생성'
                """,
                (user_id, item_id),
            )
        # 로그 생성 완료 후 상태 업데이트
        cur.execute(
            "UPDATE users SET log_generated = TRUE WHERE user_id = ?", (user_id,)
        )
        conn.commit()
        return jsonify({"status": "success"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/api/check", methods=["POST"])
def run_checklist():
    data = request.json
    if not data or "user_id" not in data:
        error_message = "Invalid request"
        logging.error(f"[ERROR] {error_message}")
        return jsonify({"error": error_message}), 400
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        print(data["item_type"])
        # 체크리스트 항목 조회
        cur.execute(
            "SELECT item_id FROM checklist_items WHERE item_name LIKE %s",
            (f'{data["item_type"]}%',),
        )
        item_result = cur.fetchone()
        if not item_result:
            error_message = f"[{data['item_type']}] 체크리스트 항목을 찾을 수 없습니다"
            logging.error(f"{error_message}")
            return jsonify({"error": error_message}), 404
        user_id = data["user_id"]
        item_id = item_result[0]
        actual_value = json.dumps(data["actual_value"], ensure_ascii=False)
        notes = data.get("notes", "")
        # 기존 로그 확인 및 업데이트 또는 삽입
        cur.execute(
            """
            INSERT INTO audit_log (user_id, item_id, actual_value, notes)
            VALUES (?, ?, ?, ?)
            """,
            (user_id, item_id, actual_value, notes),
        )
        conn.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        conn.rollback()
        error_message = str(e)
        logging.error(f"[ERROR 500] {error_message}")
        return jsonify({"status": "failed", "message": error_message}), 500
    finally:
        conn.close()


@app.route("/api/audit_history", methods=["POST"])
def audit_history():
    data = request.json
    if not data or "user_id" not in data:
        error_message = "Invalid request"
        logging.error(f"[ERROR] {error_message}")
        return jsonify({"error": error_message}), 400
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        print(data["item_type"])
        # 체크리스트 항목 조회
        cur.execute(
            "SELECT item_id FROM checklist_items WHERE item_name LIKE %s",
            (f'{data["item_type"]}%',),
        )
        item_result = cur.fetchone()
        if not item_result:
            error_message = f"[{data['item_type']}] 체크리스트 항목을 찾을 수 없습니다"
            logging.error(f"{error_message}")
            return jsonify({"error": error_message}), 404
        user_id = data["user_id"]
        item_id = item_result[0]
        actual_value = json.dumps(data["actual_value"], ensure_ascii=False)
        notes = data.get("notes", "")
        # 기존 로그 확인 및 업데이트 또는 삽입
        cur.execute(
            """
            INSERT INTO audit_log (user_id, item_id, actual_value, notes)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            actual_value = VALUES(actual_value),
            checked_at = CURRENT_TIMESTAMP,
            notes = VALUES(notes)
            """,
            (user_id, item_id, actual_value, notes),
        )
        conn.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        conn.rollback()
        error_message = str(e)
        logging.error(f"[ERROR 500] {error_message}")
        return jsonify({"status": "failed", "message": error_message}), 500
    finally:
        conn.close()


@app.route("/api/logs")
def get_logs():
    emp_id = request.args.get("emp_id")  # Get the emp_id from query parameters
    conn = get_db_connection()
    cur = conn.cursor()
    # 사용자 정보와 함께 조인하여 조회
    cur.execute(
        """
        SELECT
            l.*,
            u.username as user_name,
            u.department,
            ci.description,
            ci.item_name,
            ci.category as item_category
        FROM audit_log l
        JOIN users u ON l.user_id = u.user_id
        JOIN checklist_items ci ON l.item_id = ci.item_id
        WHERE u.emp_id = ?
        ORDER BY ci.item_id ASC
        """,
        (emp_id,),
    )
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    logs = []
    for row in rows:
        log = dict(zip(columns, row))
        log["actual_value"] = json.loads(log["actual_value"])
        # null 값을 그대로 유지하고, 그 외의 값만 bool로 변환
        if log["passed"] is None:
            log["passed"] = None
        else:
            log["passed"] = bool(log["passed"])
        logs.append(log)

    conn.close()
    return jsonify(logs)


@app.route("/api/check/<int:log_id>", methods=["POST"])
def screen_saver_logic(log_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT actual_value, item_id
            FROM audit_log
            WHERE log_id = ?
            """,
            (log_id,),
        )
        result = cur.fetchone()
        if not result:
            return jsonify({"error": "로그를 찾을 수 없습니다"}), 404
        actual_value = json.loads(result[0])
        item_id = result[1]
        item_name = get_item_name(item_id)
        logging.info(item_name)
        # passed 값을 None으로 유지해야 하는 item_name 목록
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
            # 추가적인 예외 항목들...
        ]
        # 예외 목록에 있는 경우 passed 값을 업데이트하지 않음
        if item_name in EXCEPTION_ITEM_NAMES:
            return jsonify({"status": "success", "passed": None})
        # 적절한 전략 선택
        strategy = VALIDATION_STRATEGIES.get(item_name, DefaultValidation())
        passed = strategy.validate(actual_value)
        # 결과 저장 및 반환
        cur.execute(
            """
            UPDATE audit_log
            SET passed = ?
            WHERE log_id = ?
            """,
            (1 if passed else 0, log_id),
        )
        conn.commit()
        return jsonify({"status": "success", "passed": passed})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/api/logs2")
def get_logs2():
    emp_id = request.args.get("emp_id")  # Get the emp_id from query parameters
    conn = get_db_connection()
    cur = conn.cursor()
    # 사용자 정보와 함께 조인하여 조회
    cur.execute(
        """
        SELECT
            l.*,
            u.username as user_name,
            u.department,
            ci.description,
            ci.item_name,
            ci.category as item_category
        FROM audit_log l
        JOIN users u ON l.user_id = u.user_id
        JOIN checklist_items ci ON l.item_id = ci.item_id
        WHERE u.emp_id = ?
        ORDER BY ci.item_id ASC
        """,
        (emp_id,),
    )
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    logs = []
    for row in rows:
        log = dict(zip(columns, row))
        log["actual_value"] = json.loads(log["actual_value"])
        # null 값을 그대로 유지하고, 그 외의 값만 bool로 변환
        if log["passed"] is None:
            log["passed"] = None
        else:
            log["passed"] = bool(log["passed"])
        logs.append(log)

    conn.close()
    return jsonify(logs)


@app.route("/download")
def download_file():
    return send_file(
        "download_files/보안감사압축파일.zip",
        mimetype="application/zip",
        as_attachment=True,
    )


# 데이터베이스 연결 함수
def get_db_connection2():
    return pymysql.connect(**DB_CONFIG2)


# # API 엔드포인트: 보안 감사 로그 목록 조회
# @app.route("/api/security-audit/logs", methods=["GET"])
# def get_audit_logs():
#     try:
#         conn = get_db_connection2()
#         with conn.cursor() as cursor:
#             # 모든 로그를 날짜 역순으로 가져오기
#             cursor.execute(
#                 """
#                 SELECT log_id, user_id, item_id, actual_value, passed, notes, checked_at
#                 FROM audit_log
#                 ORDER BY checked_at DESC
#             """
#             )

#             logs = cursor.fetchall()
#         conn.close()

#         result = []
#         for log in logs:
#             # MariaDB의 JSON 타입이 자동으로 파싱되지 않을 수 있으므로 확인
#             if isinstance(log["actual_value"], str):
#                 actual_value = json.loads(log["actual_value"])
#             else:
#                 actual_value = log["actual_value"]

#             # checked_at이 datetime 객체라면 문자열로 변환
#             if isinstance(log["checked_at"], datetime):
#                 checked_at = log["checked_at"].strftime("%Y-%m-%d %H:%M:%S")
#             else:
#                 checked_at = log["checked_at"]

#             result.append(
#                 {
#                     "log_id": log["log_id"],
#                     "user_id": log["user_id"],
#                     "item_id": log["item_id"],
#                     "actual_value": actual_value,
#                     "passed": log["passed"],
#                     "notes": log["notes"],
#                     "checked_at": checked_at,
#                 }
#             )

#         return jsonify(result)

#     except Exception as e:
#         print(f"Error in get_audit_logs: {str(e)}")
#         return jsonify({"error": str(e)}), 500


# # API 엔드포인트: 보안 통계 데이터 조회
# @app.route("/api/security-audit/stats", methods=["GET"])
# def get_security_stats():
#     try:
#         conn = get_db_connection2()
#         with conn.cursor() as cursor:
#             # 총 체크리스트 항목 수 조회
#             cursor.execute(
#                 """
#                 SELECT COUNT(*) as total_items
#                 FROM checklist_items
#             """
#             )
#             total_items_result = cursor.fetchone()
#             total_checks = total_items_result["total_items"]

#             # 가장 최근 감사 날짜 조회
#             cursor.execute(
#                 """
#                 SELECT MAX(checked_at) as last_audit_date
#                 FROM audit_log
#             """
#             )
#             last_audit_result = cursor.fetchone()
#             last_audit_date = last_audit_result["last_audit_date"]

#             # 통과한 검사 항목 수 조회
#             cursor.execute(
#                 """
#                 SELECT COUNT(DISTINCT item_id) as completed_checks
#                 FROM audit_log
#                 WHERE passed = 1
#             """
#             )
#             passed_checks_result = cursor.fetchone()
#             completed_checks = passed_checks_result["completed_checks"]

#             # 심각한 문제(통과하지 못한 항목) 수 조회
#             cursor.execute(
#                 """
#                 SELECT COUNT(DISTINCT item_id) as critical_issues
#                 FROM audit_log
#                 WHERE passed = 0
#             """
#             )
#             failed_checks_result = cursor.fetchone()
#             critical_issues = failed_checks_result["critical_issues"]

#         conn.close()

#         # 날짜 포맷 변환
#         formatted_date = last_audit_date.strftime("%Y-%m-%d") if last_audit_date else ""

#         # 응답 데이터 구성
#         stats = {
#             "lastAuditDate": formatted_date,
#             "totalChecks": total_checks,
#             "completedChecks": completed_checks,
#             "criticalIssues": critical_issues,
#         }

#         return jsonify(stats)

#     except Exception as e:
#         print(f"Error in get_security_stats: {str(e)}")
#         return jsonify({"error": str(e)}), 500


# API 엔드포인트: 사용자별 보안 감사 로그 목록 조회 (수정됨)
@app.route("/api/security-audit/logs", methods=["GET"])
def get_audit_logs():
    try:
        # 사용자 ID 가져오기
        user_id = request.args.get("user_id")

        if not user_id:
            return jsonify({"error": "사용자 ID가 필요합니다."}), 400

        conn = get_db_connection2()
        with conn.cursor() as cursor:
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
        # 사용자 ID 가져오기 (필터링에 사용할 수 있음)
        user_id = request.args.get("user_id")

        conn = get_db_connection2()
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


# API 엔드포인트: 사용자별 보안 통계 데이터 조회
@app.route("/api/security-audit/stats", methods=["GET"])
def get_security_stats():
    try:
        # 사용자 ID 가져오기
        user_id = request.args.get("user_id")

        if not user_id:
            return jsonify({"error": "사용자 ID가 필요합니다."}), 400

        conn = get_db_connection2()
        with conn.cursor() as cursor:
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


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)