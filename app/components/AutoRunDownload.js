// components/AutoRunDownload.js
import { useState } from 'react';
import JSZip from 'jszip';

export default function AutoRunDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  // 배치 스크립트 내용 생성 - Windows CRLF 개행 문자 확실하게 적용
  const createScriptContent = () => {
    const rawContent = `
@echo off
:: === 이동식 미디어 자동실행 보안 설정 스크립트 ===
REM UTF-8 인코딩 설정
chcp 65001 > nul

:: 관리자 권한 확인 및 요청
>nul 2>&1 "%SYSTEMROOT%\\system32\\cacls.exe" "%SYSTEMROOT%\\system32\\config\\system"
if '%errorlevel%' NEQ '0' (
    echo 관리자 권한으로 실행합니다...
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\\getadmin.vbs"
    echo args = "" >> "%temp%\\getadmin.vbs"
    echo For Each strArg in WScript.Arguments >> "%temp%\\getadmin.vbs"
    echo args = args ^& " " ^& strArg >> "%temp%\\getadmin.vbs"
    echo Next >> "%temp%\\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", args, "", "runas", 1 >> "%temp%\\getadmin.vbs"
    "%temp%\\getadmin.vbs"
    del "%temp%\\getadmin.vbs"
    exit /B
)

echo.
echo ===== 이동식 미디어 자동실행 보안 설정 도구 =====
echo.

:: === 현재 설정 확인 ===
echo 현재 자동실행 설정 확인 중...
reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v NoDriveTypeAutoRun 2>nul
if %errorlevel% EQU 0 (
    for /f "tokens=2*" %%a in ('reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v NoDriveTypeAutoRun ^| find "NoDriveTypeAutoRun"') do (
        echo 현재 설정값: %%b
        set CURRENT_VALUE=%%b
    )
) else (
    echo 현재 자동실행 설정이 구성되어 있지 않습니다.
    set CURRENT_VALUE=없음
)

echo.
echo === 자동실행 설정 제한 옵션 ===
echo 1. 모든 드라이브 유형에 대해 자동실행 비활성화 (권장, 값: 255 / 0xff)
echo 2. 대부분의 드라이브 유형에 대해 자동실행 비활성화 (값: 95 / 0x5f)
echo 3. 이동식 드라이브에 대해서만 자동실행 비활성화 (값: 91 / 0x5b)
echo 4. 현재 설정 유지

set /p OPTION="설정 옵션을 선택하세요 (1-4): "

if "%OPTION%"=="1" (
    set NEW_VALUE=255
    set VALUE_NAME=모든 드라이브에 대해 자동실행 비활성화
) else if "%OPTION%"=="2" (
    set NEW_VALUE=95
    set VALUE_NAME=대부분의 드라이브 유형에 대해 자동실행 비활성화
) else if "%OPTION%"=="3" (
    set NEW_VALUE=91
    set VALUE_NAME=이동식 드라이브에 대해서만 자동실행 비활성화
) else if "%OPTION%"=="4" (
    echo 설정을 변경하지 않고 종료합니다.
    goto end
) else (
    echo 잘못된 옵션입니다. 설정을 변경하지 않고 종료합니다.
    goto end
)

echo.
echo 선택한 설정: %VALUE_NAME% (값: %NEW_VALUE%)
echo.

echo 설정을 적용하시겠습니까?
set /p CONFIRM="예(Y) 또는 아니오(N)를 입력하세요: "
if /i "%CONFIRM%"=="Y" (
    echo 자동실행 제한 설정을 적용합니다...
    reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v NoDriveTypeAutoRun /t REG_DWORD /d %NEW_VALUE% /f
    if %errorlevel% EQU 0 (
        echo 설정이 성공적으로 적용되었습니다.
    ) else (
        echo 설정 적용 중 오류가 발생했습니다.
    )
) else (
    echo 설정 적용을 취소했습니다.
)

:end
echo.
echo === 설정 확인 ===
reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v NoDriveTypeAutoRun

echo.
echo 작업이 완료되었습니다. 아무 키나 눌러 종료하세요...
pause > nul
`;
    // 명시적으로 모든 줄바꿈을 Windows CRLF로 변환
    return rawContent.replace(/\n/g, '\r\n');
  };

  // 스크립트 내용 함수로 생성
  const scriptContent = createScriptContent();

  // 안내문 파일 내용 - README는 LF 형식이어도 무방
  const readmeContent = `# 이동매체 자동실행 제한 설정 도구 사용 안내

## 개요
이 스크립트는 이동식 미디어(USB 드라이브, CD/DVD 등)의 자동실행 기능을 제한하여 
악성코드로부터 시스템을 보호하기 위한 도구입니다.

## 실행 방법
1. '자동실행제한설정.bat' 파일을 마우스 오른쪽 버튼으로 클릭하고 "관리자 권한으로 실행"을 선택하세요.
2. 화면에 나타나는 안내에 따라 원하는 보안 수준을 선택하세요.

## 설정 옵션 설명
1. **모든 드라이브 유형에 대해 자동실행 비활성화 (값: 255)**
   - 가장 강력한 보안 수준으로, 모든 유형의 드라이브에서 자동실행 기능을 비활성화합니다.
   - 보안 감사 요구사항을 충족하기 위해 권장되는 설정입니다.

2. **대부분의 드라이브 유형에 대해 자동실행 비활성화 (값: 95)**
   - 대부분의 드라이브 유형에서 자동실행 기능을 비활성화합니다.
   - 일부 네트워크 드라이브에서는 자동실행이 가능할 수 있습니다.

3. **이동식 드라이브에 대해서만 자동실행 비활성화 (값: 91)**
   - USB 드라이브와 같은 이동식 미디어에서만 자동실행 기능을 비활성화합니다.
   - 최소한의 보안 수준으로, 보안 감사 요구사항을 충족하지 못할 수 있습니다.

## 주의사항
- 스크립트 실행 전 열려있는 프로그램을 저장하고 닫아주세요.
- 이 설정은 시스템 전체에 적용되며 모든 사용자에게 영향을 미칩니다.
- 변경 사항은 즉시 적용됩니다.

## 지원
자동실행 제한 설정 관련 문의사항은 보안관리팀(내선 1234 또는 security@example.com)에 문의해주세요.`;

  // 압축 다운로드 처리
  const handleZipDownload = async () => {
    setIsDownloading(true);

    try {
      // 배치 파일에 UTF-8 BOM 추가 (Windows에서 UTF-8로 인식하게 함)
      const utf8BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const scriptContentWithBOM = new Blob([utf8BOM, scriptContent], { type: 'application/octet-stream' });
      const scriptBuffer = await scriptContentWithBOM.arrayBuffer();

      // JSZip 인스턴스 생성
      const zip = new JSZip();

      // 파일 추가 - 바이너리 모드로 추가하여 변환 방지
      zip.file('자동실행제한설정.bat', scriptBuffer, { binary: true });
      zip.file('README.txt', readmeContent);

      // ZIP 생성
      const zipContent = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }, // 최대 압축 레벨
        platform: 'DOS' // Windows 환경에 맞게 설정
      });

      // 다운로드
      const url = URL.createObjectURL(zipContent);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'autorun_security_tool.zip';
      document.body.appendChild(link);
      link.click();

      // 정리
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      }, 100);
    } catch (error) {
      console.error('압축 다운로드 오류:', error);
      alert('압축 파일 생성 중 오류가 발생했습니다.');
      setIsDownloading(false);
    }
  };

  // 직접 배치 파일만 다운로드 (백업용 기능)
  const handleDirectBatchDownload = () => {
    try {
      // UTF-8 BOM 추가 (Windows에서 UTF-8로 인식하게 함)
      const utf8BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
      
      // 배치 파일을 바이너리로 처리하고 BOM 추가
      const blob = new Blob([utf8BOM, scriptContent], {
        type: 'application/octet-stream'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '자동실행제한설정.bat';
      document.body.appendChild(link);
      link.click();

      // 정리
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('배치 파일 다운로드 오류:', error);
      alert('배치 파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <button
      className="download-button primary-download"
      onClick={handleZipDownload}
      disabled={isDownloading}
    >
      {isDownloading ? '다운로드 중...' : '자동실행 제한 설정 도구 다운로드'}
    </button>
  );
}