// app/security-audit/solutions/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";
import Link from "next/link";

export default function SecurityAuditSolutionPage() {
  const pathname = usePathname();

  const solutionItems = [
    {
      title: "화면보호기 사용",
      path: "/security-audit/solutions/screen-saver",
      description: "화면보호기 10분 이내 설정 및 암호화 적용"
    },
    {
      title: "이동매체 자동실행 제한",
      path: "/security-audit/solutions/auto-run",
      description: "USB 및 외부 저장장치 자동실행 기능 비활성화"
    },
    {
      title: "백신 상태 확인",
      path: "/security-audit/solutions/antivirus",
      description: "바이러스 백신 설치, 실시간 보호, 최신 업데이트 확인"
    },
    {
      title: "패스워드 길이 및 복잡도",
      path: "/security-audit/solutions/password-policy",
      description: "8자 이상 강력한 패스워드 정책 적용 및 정기적 변경"
    },
    {
      title: "공유폴더 확인",
      path: "/security-audit/solutions/shared-folder",
      description: "불필요한 공유폴더 제거 및 접근 권한 관리"
    },
    {
      title: "원격데스크톱 제한",
      path: "/security-audit/solutions/remote-desktop",
      description: "원격 접속 비활성화 또는 승인된 사용자로 제한"
    },
    {
      title: "방화벽 활성화 확인",
      path: "/security-audit/solutions/firewall",
      description: "모든 네트워크 프로필에 방화벽 적용 상태 점검"
    }
  ];

  return (
    <div>
      <h1 className="page-title">보안 감사 조치방법</h1>

      <div className="section">
        <h2 className="section-title">조치방법 개요</h2>
        <p>
          이 페이지에서는 정보보안 감사에서 확인해야 할 주요 항목에 대한 조치방법을 안내합니다. 
          모든 가이드는 조직의 보안 정책을 준수하기 위한 기본적인 설정 방법과 점검 사항을 제공합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">주요 조치사항</h2>
        <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
          <li>화면보호기 설정: 비활성화 시간 10분 이내로 설정 및 재시작 시 암호 설정 적용</li>
          <li>이동매체 자동실행 제한: USB 및 외부 저장장치의 자동실행 기능 비활성화</li>
          <li>백신 프로그램 관리: 승인된 백신 설치, 실시간 보호 활성화 및 최신 업데이트 유지</li>
          <li>패스워드 정책 준수: 8자 이상 영문/숫자/특수문자 조합, 90일 이내 변경, 재사용 제한</li>
          <li>공유폴더 보안: 불필요한 공유폴더 제거 및 필요한 공유폴더의 접근 권한 제한</li>
          <li>원격접속 통제: 원격 데스크톱 비활성화 또는 승인된 사용자로 제한</li>
          <li>방화벽 설정: 도메인, 개인, 공용 모든 네트워크 프로필에 방화벽 활성화</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">항목별 상세 가이드</h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "20px",
          marginTop: "15px"
        }}>
          {solutionItems.map((item, index) => (
            <Link 
              href={item.path} 
              key={index}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px",
                padding: "20px", 
                backgroundColor: "#f9f9f9",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                height: "100%",
                boxSizing: "border-box"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <h3 style={{ marginTop: "0", color: "#2c5282" }}>{item.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#4a5568" }}>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">조치 결과 확인</h2>
        <p>
          각 항목에 대한 조치를 완료한 후, 보안 감사 배치 스크립트를 다시 실행하여 정상적으로 
          조치되었는지 확인하세요. 조치 완료 후에도 보안 상태가 "실패"로 표시되는 경우, 
          해당 항목의 세부 가이드를 참고하거나 보안관리팀에 문의하세요.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">지원 및 문의</h2>
        <p>
          보안 감사 항목 조치에 어려움이 있거나 추가 지원이 필요한 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안관리팀: 내선 1234 또는 security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}