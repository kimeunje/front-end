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
          <li> 화면보호기 설정 점검: 비활성화 시간 10분 이내로 설정 및 암호화 적용</li>
          <li> 패스워드 정책 준수: 9자리 이상 영문/숫자/특수문자 조합 사용</li>
          <li> 공유폴더 보안 점검: 인가되지 않은 공유폴더 제거 및 접근통제</li>
          <li> 미승인 프린터 점검: 비인가 프린터 연결 금지 및 주기적 검사</li>
          <li> 원격접속 통제 확인: 승인된 사용자 및 IP 주소로 제한 조치</li>
          <li> 방화벽 정책 점검: 내부 네트워크 보호를 위한 인바운드/아웃바운드 규칙 확인</li>
        </ul>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}