// components/HomeDownload.js
import { useState } from 'react';
import JSZip from 'jszip';

export default function HomeDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  // 배치 스크립트 내용 - Windows CRLF 개행 문자 확실하게 적용
  // 모든 줄바꿈을 \r\n으로 명시적으로 변환
  const createScriptContent = () => {
    const rawContent = `
@echo off
:: === 환경 설정 ===
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

:: === 현재 값 표시 ===
echo 현재 설정된 값:

powershell -Command ^
    $computerSystem = Get-WmiObject Win32_ComputerSystem; ^
    $workgroup = $computerSystem.Workgroup; ^
    $computername = $computerSystem.Name; ^
    $username = $env:USERNAME; ^
    Write-Host "현재 부서명:"; ^
    Write-Host $workgroup; ^
    Write-Host "현재 컴퓨터명:"; ^
    Write-Host $computername; ^
    Write-Host "현재 사용자명:" ;^
    Write-Host $username";

echo.
echo === 값 변경 시작 ===

:: === 새 값 입력 받기 ===
set NEW_WORKGROUP="방가"
set NEW_COMPUTERNAME="햄토리"
set NEW_USERNAME="햄스터"


echo 잠시만 기다려주세요. 1~2분 정도 소요됩니다....
powershell -Command ^
    $username = $env:USERNAME; ^
    Add-Computer -WorkgroupName '%NEW_WORKGROUP%' -NewName '%NEW_COMPUTERNAME%' -Force; ^
    Rename-LocalUser -Name $username -NewName '%NEW_USERNAME%';


echo.
echo === 변경 작업 완료 ===
echo 일부 변경사항은 시스템 재시작 후 적용됩니다.
echo 재부팅하시겠습니까?
set /p REBOOT_CHOICE="재부팅(Y/N): "
if /i "%REBOOT_CHOICE%"=="Y" (
    shutdown /r /t 10 /c "시스템 설정 변경으로 인한 재부팅"
    echo 10초 후 시스템이 재부팅됩니다...
) else (
    echo 재부팅을 취소했습니다. 나중에 수동으로 재부팅하세요.
)

pause
`;
    // 명시적으로 모든 줄바꿈을 Windows CRLF로 변환
    return rawContent.replace(/\n/g, '\r\n');
  };

  // 스크립트 내용 함수로 생성
  const scriptContent = createScriptContent();

  // 안내문 파일 내용 - README는 LF 형식이어도 무방
  const readmeContent = `# 컴퓨터 설정 스크립트 사용 안내

## 개요
이 스크립트는 상시보안감사 시스템을 위한 컴퓨터 설정 도구입니다. 
컴퓨터 이름, 작업 그룹(부서명) 및 사용자 이름을 쉽게 설정할 수 있도록 도와줍니다.

## 실행 방법
1. '컴퓨터정보변경.bat' 파일을 마우스 오른쪽 버튼으로 클릭하고 "관리자 권한으로 실행"을 선택하세요.
2. 화면에 나타나는 안내에 따라 정보를 입력하세요.

## 주의사항
- 스크립트 실행 전 모든 중요 문서를 저장하고 열려있는 프로그램을 닫아주세요.
- 설정 변경 시 시스템 재부팅이 필요할 수 있습니다.
- 컴퓨터 이름과 사용자 이름은 본인의 이름으로, 작업 그룹은 소속 부서명으로 설정하는 것을 권장합니다.
- 사용자 이름을 변경하면 로그인 후 프로필 폴더 경로도 변경될 수 있습니다.

## 지원
보안 감사 관련 문의사항은 IT 보안팀에 문의하거나 내선 5678로 연락해주세요.`;

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
      // scriptContent는 이미 createScriptContent()에서 CRLF로 변환됨
      zip.file('컴퓨터정보변경.bat', scriptBuffer, { binary: true });
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
      link.download = '컴퓨터설정도구.zip';
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
        // endings 옵션 제거 - 우리가 이미 CRLF로 변환했기 때문
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '컴퓨터정보변경.bat';
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
      {isDownloading ? '다운로드 중...' : '컴퓨터 설정 도구 다운로드'}
    </button>
  );
}