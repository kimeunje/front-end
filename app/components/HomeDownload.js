// components/HomeDownload.js
import { useState } from 'react';
import JSZip from 'jszip';

export default function HomeDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  // 배치 스크립트 내용 - Windows CRLF 개행 문자(\r\n) 적용
  const scriptContent = `@echo off\r
:: === 환경 설정 === \r
REM UTF-8 인코딩 설정 \r
chcp 65001 > nul\r
setlocal enabledelayedexpansion\r
\r
echo ================================================\r
echo          컴퓨터 정보 확인 및 변경 도구\r
echo          (상시보안감사 시스템 초기설정)\r
echo ================================================\r
echo.\r
\r
REM 관리자 권한 확인\r
NET SESSION >nul 2>&1\r
if %ERRORLEVEL% neq 0 (\r
    echo [경고] 이 스크립트는 관리자 권한으로 실행해야 합니다.\r
    echo 관리자 권한으로 다시 실행해 주세요.\r
    pause\r
    exit /b 1\r
)\r
\r
REM 현재 정보 확인\r
echo [진행] 현재 시스템 정보를 확인 중입니다...\r
echo.\r
\r
powershell -Command ^\r
    $computerSystem = Get-WmiObject Win32_ComputerSystem; ^\r
    $workgroup = $computerSystem.Workgroup; ^\r
    $computername = $computerSystem.Name; ^\r
    $username = $env:USERNAME; ^\r
    Write-Host "컴퓨터에 저장된 부서명(작업그룹): $workgroup"; ^\r
    Write-Host "컴퓨터에 저장된 사용자명(컴퓨터명): $computername"; ^\r
    Write-Host "윈도우에 저장된 사용자명: $username"\r
\r
echo.\r
echo ------------------------------------------------\r
echo.\r
\r
REM 변경 여부 확인\r
set /p changeComputer=컴퓨터 이름을 변경하시겠습니까? (Y/N): \r
\r
if /i "%changeComputer%"=="Y" (\r
    REM 사용자 이름으로 자동 설정 또는 직접 입력 선택\r
    echo.\r
    echo 1. 현재 사용자 이름으로 자동 설정\r
    echo 2. 직접 입력\r
    echo.\r
    set /p autoOrManual=선택하세요 (1/2): \r
    \r
    if "!autoOrManual!"=="1" (\r
        REM 현재 사용자 이름으로 설정\r
        for /f "tokens=*" %%a in ('powershell -Command "$env:USERNAME"') do set newComputerName=%%a\r
        echo.\r
        echo 컴퓨터 이름을 [!newComputerName!]으로 변경합니다.\r
    ) else (\r
        REM 직접 입력 받기\r
        echo.\r
        set /p newComputerName=새 컴퓨터 이름을 입력하세요: \r
    )\r
    \r
    REM 컴퓨터 이름 변경\r
    echo.\r
    echo [진행] 컴퓨터 이름을 변경 중입니다...\r
    powershell -Command "Rename-Computer -NewName '!newComputerName!' -Force"\r
    if %ERRORLEVEL% equ 0 (\r
        echo [성공] 컴퓨터 이름이 [!newComputerName!]으로 변경되었습니다.\r
    ) else (\r
        echo [오류] 컴퓨터 이름 변경 중 오류가 발생했습니다.\r
    )\r
)\r
\r
echo.\r
echo ------------------------------------------------\r
echo.\r
\r
REM 작업 그룹 변경 여부 확인\r
set /p changeWorkgroup=작업 그룹(부서명)을 변경하시겠습니까? (Y/N): \r
\r
if /i "%changeWorkgroup%"=="Y" (\r
    echo.\r
    set /p newWorkgroup=새 작업 그룹(부서명)을 입력하세요: \r
    \r
    REM 작업 그룹 변경\r
    echo.\r
    echo [진행] 작업 그룹을 변경 중입니다...\r
    powershell -Command "Add-Computer -WorkgroupName '!newWorkgroup!' -Force"\r
    if %ERRORLEVEL% equ 0 (\r
        echo [성공] 작업 그룹이 [!newWorkgroup!]으로 변경되었습니다.\r
    ) else (\r
        echo [오류] 작업 그룹 변경 중 오류가 발생했습니다.\r
    )\r
)\r
\r
echo.\r
echo ================================================\r
echo.\r
\r
REM 변경 사항이 있으면 재부팅 제안\r
if /i "%changeComputer%"=="Y" (\r
    set needReboot=Y\r
) else if /i "%changeWorkgroup%"=="Y" (\r
    set needReboot=Y\r
) else (\r
    set needReboot=N\r
)\r
\r
if /i "!needReboot!"=="Y" (\r
    echo 변경 사항을 적용하려면 시스템을 재부팅해야 합니다.\r
    echo.\r
    set /p rebootNow=지금 재부팅하시겠습니까? (Y/N): \r
    \r
    if /i "!rebootNow!"=="Y" (\r
        echo.\r
        echo 10초 후 시스템이 재부팅됩니다...\r
        echo 열려있는 모든 프로그램을 저장하고 닫아주세요.\r
        shutdown /r /t 10 /c "컴퓨터 이름/작업그룹 변경으로 인한 재부팅"\r
    ) else (\r
        echo.\r
        echo 나중에 시스템을 재부팅해주세요.\r
    )\r
) else (\r
    echo 변경 사항이 없습니다.\r
)\r
\r
echo.\r
echo ================================================\r
echo            상시보안감사 시스템 초기설정 완료            \r
echo ================================================\r
echo.\r
echo 설정이 완료되었습니다. 웹 브라우저로 돌아가서 '초기 설정 완료 표시' 버튼을 클릭해주세요.\r
echo.\r
pause`;

  // 안내문 파일 내용 - README는 LF 형식이어도 무방
  const readmeContent = `# 컴퓨터 설정 스크립트 사용 안내

## 개요
이 스크립트는 상시보안감사 시스템을 위한 컴퓨터 설정 도구입니다. 
컴퓨터 이름과 작업 그룹(부서명)을 쉽게 설정할 수 있도록 도와줍니다.

## 실행 방법
1. '컴퓨터정보변경.bat' 파일을 마우스 오른쪽 버튼으로 클릭하고 "관리자 권한으로 실행"을 선택하세요.
2. 화면에 나타나는 안내에 따라 정보를 입력하세요.

## 주의사항
- 스크립트 실행 전 모든 중요 문서를 저장하고 열려있는 프로그램을 닫아주세요.
- 설정 변경 시 시스템 재부팅이 필요할 수 있습니다.
- 컴퓨터 이름은 사용자 본인의 이름으로, 작업 그룹은 소속 부서명으로 설정하는 것을 권장합니다.

## 지원
보안 감사 관련 문의사항은 IT 보안팀에 문의하거나 내선 5678로 연락해주세요.`;

  // 압축 다운로드 처리
  const handleZipDownload = async () => {
    setIsDownloading(true);
    
    try {
      // JSZip 인스턴스 생성
      const zip = new JSZip();
      
      // 파일 추가 - 배치 파일은 type: 'text'로 설정하여 CRLF 유지
      zip.file('컴퓨터정보변경.bat', scriptContent, { type: 'text' });
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
      // 텍스트로 Blob 생성 시 특별한 옵션 지정 (CRLF 유지)
      const blob = new Blob([scriptContent], { 
        type: 'application/octet-stream', 
        endings: 'native' // 브라우저의 네이티브 줄바꿈 처리 사용
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