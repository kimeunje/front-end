-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        11.7.2-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 patch_management.audit_log 구조 내보내기
DROP TABLE IF EXISTS `audit_log`;
CREATE TABLE IF NOT EXISTS `audit_log` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `actual_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`actual_value`)),
  `passed` tinyint(4) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `checked_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`log_id`),
  KEY `item_id` (`item_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=634 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- 테이블 데이터 patch_management.audit_log:~21 rows (대략적) 내보내기
DELETE FROM `audit_log`;
INSERT INTO `audit_log` (`log_id`, `user_id`, `item_id`, `actual_value`, `passed`, `notes`, `checked_at`) VALUES
	(613, 4, 11, '{"Private": 1, "Domain": 1, "Public": 1}', 1, '모든 방화벽 프로필(Domain, Private, Public)이 정상적으로 활성화되어 있습니다.', '2025-05-19 14:58:35'),
	(614, 4, 1, '{"screenSaverTime": "600", "screenSaverSecure": "0", "screenSaverEnabled": "1"}', 0, '화면 보호기 설정이 정책에 맞지 않습니다. 현재 설정: 활성화=1, 시간=600초, 암호설정=0. 화면 보호기 활성화 및 10분(600초) 이내 설정, 재시작 시 암호 필요 옵션을 켜주세요.', '2025-05-19 14:58:40'),
	(615, 4, 3, '{"user_name": "컴퓨터", "computer_name": "DESKTOP-M79KG4R", "workgroup": "WORKGROUP"}', 1, '사용자 계정명이 적절하게 설정되어 있습니다.', '2025-05-19 14:58:46'),
	(616, 4, 4, '{"user_name": "컴퓨터", "accounts": ["Administrator", "DefaultAccount", "Guest", "WDAGUtilityAccount", "WsiAccount", "컴퓨터"]}', 0, '불필요한 계정이 발견되었습니다. 필요하지 않은 계정을 비활성화하거나 제거해주세요.', '2025-05-19 14:58:54'),
	(617, 4, 5, '{"minimumPasswordLength": "8"}', 1, '암호 길이가 정책에 맞게 설정되어 있습니다.', '2025-05-19 14:59:02'),
	(618, 4, 6, '{"passwordComplexity": "1"}', 1, '암호 복잡도가 적절하게 설정되어 있습니다.', '2025-05-19 14:59:02'),
	(619, 4, 7, '{"maximumPasswordAge": "91"}', 1, '암호 변경 주기가 적절하게 설정되어 있습니다.', '2025-05-19 14:59:02'),
	(620, 4, 8, '{"passwordHistorySize": "5"}', 1, '동일 암호 사용 제한이 적절하게 설정되어 있습니다.', '2025-05-19 14:59:02'),
	(621, 4, 9, '{"folders": ["ADMIN$", "C$", "D$", "E$", "F$", "IPC$"]}', 0, '불필요한 공유 폴더가 있습니다. 필요하지 않은 공유 폴더를 제거해주세요.', '2025-05-19 14:59:10'),
	(622, 4, 10, '{"fDenyTSConnections": 1}', 1, '원격 데스크톱이 적절하게 제한되어 있습니다.', '2025-05-19 14:59:18'),
	(623, 4, 11, '{"Private": 1, "Domain": 1, "Public": 1}', 1, '모든 방화벽 프로필(Domain, Private, Public)이 정상적으로 활성화되어 있습니다.', '2025-05-19 15:14:59'),
	(624, 4, 1, '{"screenSaverTime": "600", "screenSaverSecure": "1", "screenSaverEnabled": "1"}', 1, '화면 보호기가 정상적으로 설정되어 있습니다.', '2025-05-19 15:15:05'),
	(625, 4, 3, '{"user_name": "컴퓨터", "computer_name": "DESKTOP-M79KG4R", "workgroup": "WORKGROUP"}', 1, '사용자 계정명이 적절하게 설정되어 있습니다.', '2025-05-19 15:15:10'),
	(626, 4, 4, '{"user_name": "컴퓨터", "accounts": ["Administrator", "DefaultAccount", "Guest", "WDAGUtilityAccount", "WsiAccount", "컴퓨터"]}', 0, '불필요한 계정이 발견되었습니다. 필요하지 않은 계정을 비활성화하거나 제거해주세요.', '2025-05-19 15:15:18'),
	(627, 4, 5, '{"minimumPasswordLength": "8"}', 1, '암호 길이가 정책에 맞게 설정되어 있습니다.', '2025-05-19 15:15:26'),
	(628, 4, 6, '{"passwordComplexity": "1"}', 1, '암호 복잡도가 적절하게 설정되어 있습니다.', '2025-05-19 15:15:26'),
	(629, 4, 7, '{"maximumPasswordAge": "91"}', 1, '암호 변경 주기가 적절하게 설정되어 있습니다.', '2025-05-19 15:15:26'),
	(630, 4, 8, '{"passwordHistorySize": "5"}', 1, '동일 암호 사용 제한이 적절하게 설정되어 있습니다.', '2025-05-19 15:15:26'),
	(631, 4, 9, '{"folders": ["ADMIN$", "C$", "D$", "E$", "F$", "IPC$"]}', 0, '불필요한 공유 폴더가 있습니다. 필요하지 않은 공유 폴더를 제거해주세요.', '2025-05-19 15:15:34'),
	(632, 4, 10, '{"fDenyTSConnections": 1}', 1, '원격 데스크톱이 적절하게 제한되어 있습니다.', '2025-05-19 15:15:42'),
	(633, 4, 12, '{"realtimeProtectionEnabled": true, "antivirusSignatureLastUpdated": "/Date(1747629519000)/", "antivirusEnabled": true}', 0, '검사 항목이 정책에 맞지 않습니다. 확인이 필요합니다.', '2025-05-19 15:14:50');

-- 테이블 patch_management.checklist_items 구조 내보내기
DROP TABLE IF EXISTS `checklist_items`;
CREATE TABLE IF NOT EXISTS `checklist_items` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `category` text NOT NULL,
  `item_name` text NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- 테이블 데이터 patch_management.checklist_items:~12 rows (대략적) 내보내기
DELETE FROM `checklist_items`;
INSERT INTO `checklist_items` (`item_id`, `category`, `item_name`, `description`) VALUES
	(1, '접근 통제', '화면보호기 사용', '비인가자의 PC 사용 예방을 위한 화면보호기 및 잠금설정'),
	(2, '접근 통제', '이동매체 자동실행 제한', 'USB등 이동매체 자동실행 제한'),
	(3, '계정 관리', '사용자 계정명의 적정성', 'Windows 사용자 계정명은 실제 사용자 이름과 동일해야한다.'),
	(4, '계정 관리', '불필요한 계정 사용', '사용하지 않는 불필요한 계정을 상시 비활성화 해야한다.'),
	(5, '계정 관리', '패스워드 길이의 적정성', '비인가자의 접근제한을 위해 패스워드는 최소 길이 이상 설정해야한다.'),
	(6, '계정 관리', '패스워드 복잡도 설정', '비인가자의 접근제한을 위해 패스워드는 2가지 이상의 복잡도를 만족해야한다.'),
	(7, '계정 관리', '패스워드 주기적 변경', '안전한 패스워드 관리를 위해 패스워드는 주기적으로 변경해야한다.'),
	(8, '계정 관리', '동일 패스워드 설정 제한', '패스워드 변경 시 최근 사용했던 동일한 암호설정은 제한한다.'),
	(9, '네트워크 점검', '공유폴더 확인', '불필요한 파일 공유는 제한해야한다.'),
	(10, '네트워크 점검', '원격데스크톱 제한', '외부에서 접근이 가능한 원격접속기능은 해제 해야한다.'),
	(11, '네트워크 점검', '방화벽 활성화 확인', '방화벽이 해제되어 있는지 확인'),
	(12, '접근 통제', '백신 상태 확인', '백신이 설치되어 있는지 확인');

-- 테이블 patch_management.employees 구조 내보내기
DROP TABLE IF EXISTS `employees`;
CREATE TABLE IF NOT EXISTS `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `employee_id` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_employee_id` (`employee_id`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- 테이블 데이터 patch_management.employees:~5 rows (대략적) 내보내기
DELETE FROM `employees`;
INSERT INTO `employees` (`id`, `name`, `employee_id`, `created_at`) VALUES
	(1, '김철수', 'E001', '2025-02-25 13:08:33'),
	(2, '이영희', 'E002', '2025-02-25 13:08:33'),
	(3, '박민수', 'E003', '2025-02-25 13:08:33'),
	(4, '정미영', 'E004', '2025-02-25 13:08:33'),
	(5, '최동민', 'E005', '2025-02-25 13:08:33');

-- 테이블 patch_management.users 구조 내보내기
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `emp_id` varchar(50) NOT NULL,
  `department` varchar(50) NOT NULL,
  `log_generated` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uc_user_emp` (`username`,`emp_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- 테이블 데이터 patch_management.users:~4 rows (대략적) 내보내기
DELETE FROM `users`;
INSERT INTO `users` (`user_id`, `username`, `emp_id`, `department`, `log_generated`) VALUES
	(1, '김은제', 'test1', '운영실', 1),
	(2, '이영희', 'C00032', '개발팀', 0),
	(3, '박철수', 'A00324', '보안팀', 0),
	(4, 'hamtori', 'CCCCC', '운영실', 1);

-- 테이블 patch_management.users2 구조 내보내기
DROP TABLE IF EXISTS `users2`;
CREATE TABLE IF NOT EXISTS `users2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(100) NOT NULL,
  `cn` varchar(100) NOT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `ou` varchar(255) DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- 테이블 데이터 patch_management.users2:~4 rows (대략적) 내보내기
DELETE FROM `users2`;
INSERT INTO `users2` (`id`, `uid`, `cn`, `mail`, `ou`, `last_updated`) VALUES
	(16, 'test1', '새이름', 'test1@test.com', '운영실', '2025-05-19 05:34:28'),
	(17, 'test2', '테스터2', 'test2@test.com', '운영실', '2025-05-19 03:14:29'),
	(18, 'test3', '김은제', 'test3@test.com', '운영실', '2025-05-19 03:14:29'),
	(19, 'test4', '햄토리', 'test4@test.com', '개발실', '2025-05-19 12:45:16');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
