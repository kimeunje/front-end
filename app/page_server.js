// app/main.js

"use client";

import "@/app/styles/dashboard.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./components/context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const [securityStats, setSecurityStats] = useState({
    lastAuditDate: "2025-04-28",
    criticalIssues: 2,
    completedChecks: 16,
    totalChecks: 21,
  });

  return (
    <div className="dashboard-page">
      {/* 업무 개요 헤더 */}
      <div className="dashboard-header">
        <div className="welcome-message">
          <h1>상시보안감사 시스템</h1>
          <p>
            {user
              ? `${user.name}님, 안녕하세요.`
              : "보안 감사 대시보드에 오신 것을 환영합니다."}
          </p>
        </div>
        {user && (
          <div className="security-status">
            <div className="status-label">
              보안 준수율:{" "}
              <span className="status-value">
                {Math.round(
                  (securityStats.completedChecks / securityStats.totalChecks) *
                  100
                )}
                %
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(securityStats.completedChecks /
                    securityStats.totalChecks) *
                    100
                    }%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {user ? (
        // 로그인 상태 - 보안 상태 요약 표시
        <>
          {/* 보안 상태 요약 카드 */}
          <div className="dashboard-main">
            <div className="dashboard-card status-summary">
              <div className="card-header">
                <h2>보안 상태 요약</h2>
                <span className="date-info">
                  마지막 업데이트: {securityStats.lastAuditDate}
                </span>
              </div>
              <div className="status-metrics">
                <div className="metric-item">
                  <div className="metric-value critical">
                    {securityStats.criticalIssues}
                  </div>
                  <div className="metric-label">심각한 문제</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value success">
                    {securityStats.completedChecks}
                  </div>
                  <div className="metric-label">완료된 검사</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value info">
                    {securityStats.totalChecks}
                  </div>
                  <div className="metric-label">전체 검사 항목</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value success">
                    {Math.round(
                      (securityStats.completedChecks /
                        securityStats.totalChecks) *
                      100
                    )}
                  </div>
                  <div className="metric-label">준수율(%)</div>
                </div>
              </div>
              <div className="card-footer">
                <Link
                  href="/security-audit/results"
                  className="view-details-link"
                >
                  전체 결과 보기
                </Link>
              </div>
            </div>
          </div>
          
          {/* 점검 전 주의사항 카드 */}
          <div className="dashboard-main">
            <div className="dashboard-card">
              <div className="card-header">
                <h2>점검 전 주의사항</h2>
                <span className="date-info">
                  필수 사항
                </span>
              </div>
              <div className="precaution-content">
                <p>보안 감사를 진행하기 전에 다음 사항을 반드시 확인해주세요:</p>
                <ol style={{ marginLeft: '20px', marginTop: '16px', marginBottom: '20px', lineHeight: '1.5' }}>
                  <li>모든 중요 문서를 저장하고 프로그램을 종료해주세요.</li>
                  <li>점검 시간은 약 10-15분 정도 소요됩니다.</li>
                  <li>컴퓨터 이름과 작업 그룹(부서명)을 확인하고 적절히 설정해야 합니다.</li>
                </ol>
                
                <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e0e4e9' }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--dark-blue)' }}>
                    컴퓨터 이름 변경 배치 스크립트
                  </h3>
                  <pre style={{ backgroundColor: '#f0f2f4', padding: '12px', borderRadius: '6px', overflowX: 'auto', fontSize: '14px', maxHeight: '250px', overflowY: 'auto' }}>
                    <code>
{`@echo off
:: === 환경 설정 === 
REM UTF-8 인코딩 설정 
chcp 65001 > nul
setlocal enabledelayedexpansion

echo ================================================
echo          컴퓨터 정보 확인 및 변경 도구
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
echo 프로그램을 종료합니다...
pause`}
                    </code>
                  </pre>
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                    <a 
                      href="/downloads/rename_computer.bat" 
                      download 
                      className="download-button"
                    >
                      스크립트 다운로드
                    </a>
                  </div>
                </div>
                
                <div className="notice-box">
                  <p className="notice-text">
                    <strong>참고:</strong> 배치 파일은 관리자 권한으로 실행해야 합니다. 컴퓨터 이름이나 작업 그룹을 변경한 경우 시스템 재부팅이 필요합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // 로그아웃 상태 - 안내 메시지 표시
        <div className="not-logged-info">
          <div className="info-icon">
            <svg width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
          </div>
          <h2>로그인이 필요합니다</h2>
          <p>
            상시보안감사 시스템을 이용하기 위해서는 로그인이 필요합니다. 로그인
            페이지로 이동하여 로그인해 주세요.
          </p>
          <div className="login-button-container">
            <Link href="/login" className="login-page-button">
              로그인 페이지로 이동
            </Link>
          </div>
        </div>
      )}

      {/* 하단 안내 섹션 - dashboard-card 클래스 추가하여 동일한 스타일 적용 */}
      <div className="dashboard-main">
        <div className="dashboard-card">
          <div className="help-section">
            <h3>도움이 필요하신가요?</h3>
            <p>
              보안 감사 관련 문의사항은{" "}
              <Link href="/security-audit/contact" className="inline-link">
                IT 보안팀에 문의
              </Link>
              하거나 내선 <strong>5678</strong>로 연락해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}