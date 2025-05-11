// app/main.js

"use client";

import "@/app/styles/dashboard.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./components/context/AuthContext";
import HomeDownload from "./components/HomeDownload"; // HomeDownload 컴포넌트 임포트

export default function HomePage() {
  const { user } = useAuth();
  const [securityStats, setSecurityStats] = useState({
    lastAuditDate: "2025-04-28",
    criticalIssues: 2,
    completedChecks: 16,
    totalChecks: 21,
  });
  
  // 초기 설정 완료 여부 상태 추가
  const [initialSetupDone, setInitialSetupDone] = useState(false);
  
  // 컴포넌트 마운트 시 로컬 스토리지에서 초기 설정 완료 여부 확인
  useEffect(() => {
    const setupDone = localStorage.getItem('initialSetupDone');
    if (setupDone === 'true') {
      setInitialSetupDone(true);
    }
  }, []);
  
  // 초기 설정 완료 표시 함수
  const markSetupAsDone = () => {
    localStorage.setItem('initialSetupDone', 'true');
    setInitialSetupDone(true);
  };

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
          
          {/* 초기 설정 안내 카드 - 초기 설정 완료 여부에 따라 표시 */}
          {!initialSetupDone && (
            <div className="dashboard-main">
              <div className="dashboard-card setup-card">
                <div className="card-header">
                  <h2>초기 설정 필요</h2>
                  <span className="date-info important">
                    최초 1회 필수
                  </span>
                </div>
                <div className="setup-content simple">
                  <p>보안 감사를 진행하기 전에 컴퓨터 이름과 작업 그룹(부서명)을 설정해야 합니다.</p>
                  
                  <div className="setup-note">
                    <ul>
                      <li>컴퓨터 이름은 <strong>사용자 본인의 이름</strong>으로 설정하세요.</li>
                      <li>작업 그룹은 <strong>소속 부서명</strong>으로 설정하세요.</li>
                      <li>설정 후 시스템 재부팅이 필요할 수 있습니다.</li>
                    </ul>
                  </div>
                  
                  <div className="setup-actions simple">
                    <HomeDownload />
                    <button 
                      className="setup-complete-button"
                      onClick={markSetupAsDone}
                    >
                      초기 설정 완료 표시
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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

      {/* 하단 안내 섹션 */}
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