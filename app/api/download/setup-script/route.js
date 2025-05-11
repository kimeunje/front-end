// app/api/download/setup-script/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 배치 스크립트 내용
    const scriptContent = `@echo off
:: === 환경 설정 === 
REM UTF-8 인코딩 설정 
chcp 65001 > nul
setlocal enabledelayedexpansion

echo ================================================
echo          컴퓨터 정보 확인 및 변경 도구
echo          (상시보안감사 시스템 초기설정)
echo ================================================
echo.

REM 관리자 권한 확인
NET SESSION >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [경고] 이 스크립트는 관리자 권한으로 실행해야 합니다.
    echo 관리자 권한으로 다시 실행해 주세요.
    pause
    exit /b 1
)

REM 현재 정보 확인
echo [진행] 현재 시스템 정보를 확인 중입니다...
echo.

powershell -Command ^
    $computerSystem = Get-WmiObject Win32_ComputerSystem; ^
    $workgroup = $computerSystem.Workgroup; ^
    $computername = $computerSystem.Name; ^
    $username = $env:USERNAME; ^
    Write-Host "컴퓨터에 저장된 부서명(작업그룹): $workgroup"; ^
    Write-Host "컴퓨터에 저장된 사용자명(컴퓨터명): $computername"; ^
    Write-Host "윈도우에 저장된 사용자명: $username"

echo.
echo ------------------------------------------------
echo.

REM 변경 여부 확인
set /p changeComputer=컴퓨터 이름을 변경하시겠습니까? (Y/N): 

if /i "%changeComputer%"=="Y" (
    REM 사용자 이름으로 자동 설정 또는 직접 입력 선택
    echo.
    echo 1. 현재 사용자 이름으로 자동 설정
    echo 2. 직접 입력
    echo.
    set /p autoOrManual=선택하세요 (1/2): 
    
    if "!autoOrManual!"=="1" (
        REM 현재 사용자 이름으로 설정
        for /f "tokens=*" %%a in ('powershell -Command "$env:USERNAME"') do set newComputerName=%%a
        echo.
        echo 컴퓨터 이름을 [!newComputerName!]으로 변경합니다.
    ) else (
        REM 직접 입력 받기
        echo.
        set /p newComputerName=새 컴퓨터 이름을 입력하세요: 
    )
    
    REM 컴퓨터 이름 변경
    echo.
    echo [진행] 컴퓨터 이름을 변경 중입니다...
    powershell -Command "Rename-Computer -NewName '!newComputerName!' -Force"
    if %ERRORLEVEL% equ 0 (
        echo [성공] 컴퓨터 이름이 [!newComputerName!]으로 변경되었습니다.
    ) else (
        echo [오류] 컴퓨터 이름 변경 중 오류가 발생했습니다.
    )
)

echo.
echo ------------------------------------------------
echo.

REM 작업 그룹 변경 여부 확인
set /p changeWorkgroup=작업 그룹(부서명)을 변경하시겠습니까? (Y/N): 

if /i "%changeWorkgroup%"=="Y" (
    echo.
    set /p newWorkgroup=새 작업 그룹(부서명)을 입력하세요: 
    
    REM 작업 그룹 변경
    echo.
    echo [진행] 작업 그룹을 변경 중입니다...
    powershell -Command "Add-Computer -WorkgroupName '!newWorkgroup!' -Force"
    if %ERRORLEVEL% equ 0 (
        echo [성공] 작업 그룹이 [!newWorkgroup!]으로 변경되었습니다.
    ) else (
        echo [오류] 작업 그룹 변경 중 오류가 발생했습니다.
    )
)

echo.
echo ================================================
echo.

REM 변경 사항이 있으면 재부팅 제안
if /i "%changeComputer%"=="Y" (
    set needReboot=Y
) else if /i "%changeWorkgroup%"=="Y" (
    set needReboot=Y
) else (
    set needReboot=N
)

if /i "!needReboot!"=="Y" (
    echo 변경 사항을 적용하려면 시스템을 재부팅해야 합니다.
    echo.
    set /p rebootNow=지금 재부팅하시겠습니까? (Y/N): 
    
    if /i "!rebootNow!"=="Y" (
        echo.
        echo 10초 후 시스템이 재부팅됩니다...
        echo 열려있는 모든 프로그램을 저장하고 닫아주세요.
        shutdown /r /t 10 /c "컴퓨터 이름/작업그룹 변경으로 인한 재부팅"
    ) else (
        echo.
        echo 나중에 시스템을 재부팅해주세요.
    )
) else (
    echo 변경 사항이 없습니다.
)

echo.
echo ================================================
echo            상시보안감사 시스템 초기설정 완료            
echo ================================================
echo.
echo 설정이 완료되었습니다. 웹 브라우저로 돌아가서 '초기 설정 완료 표시' 버튼을 클릭해주세요.
echo.
pause`;

    // 헤더 설정
    const headers = new Headers();
    headers.append('Content-Disposition', 'attachment; filename="컴퓨터정보변경.bat"');
    headers.append('Content-Type', 'application/octet-stream');
    headers.append('Cache-Control', 'no-cache, no-store');

    // 응답 반환
    return new NextResponse(scriptContent, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error('스크립트 다운로드 오류:', error);
    return NextResponse.json(
      { error: '스크립트 파일을 다운로드하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}