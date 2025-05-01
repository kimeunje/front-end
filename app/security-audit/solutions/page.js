// app/security-audit/solutions/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function SecurityAuditSolutionPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">조치방법</h1>

      <div className="section">
        <h2 className="section-title">조치방법 개요</h2>
        <p>
          시스템 보안을 강화하기 위한 다양한 조치방법을 안내합니다. 왼쪽
          메뉴에서 세부 항목을 선택하여 상세 내용을 확인하세요.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">주요 조치사항</h2>
        <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
          <li>불필요한 프린터 제거</li>
          <li>엔드포인트 보안 솔루션 설치 및 구성</li>
          <li>패스워드 정책 준수</li>
          <li>불필요한 소프트웨어 제거</li>
          <li>방화벽 설정 강화</li>
        </ul>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}