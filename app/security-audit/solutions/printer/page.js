// app/security-audit/solutions/printer/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function PrinterSolutionPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">불분명 프린터 확인</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          시스템에 설치된 불필요한 프린터를 제거하여 보안 위험을 줄이는 방법을
          안내합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">보안 위험</h2>
        <p>
          허가되지 않은 프린터가 설치되어 있을 경우 다음과 같은 보안 위험이
          있습니다:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>데이터 유출 위험</li>
          <li>악성 코드 감염 경로 제공</li>
          <li>비인가 프린터 드라이버에 의한 시스템 취약점 발생</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">상세 조치 방법</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>Windows 검색창에서 제어판을 검색하여 실행합니다.</li>
          <li>장치 및 프린터 항목을 클릭합니다.</li>
          <li>설치된 프린터 목록을 확인합니다.</li>
          <li>
            허용된 프린터 목록:
            <ul
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "circle",
              }}
            >
              <li>Sindoh uPrint Driver</li>
              <li>OneNote 2013으로 보내기</li>
              <li>Microsoft XPS Document Writer</li>
              <li>Microsoft Print to PDF</li>
            </ul>
          </li>
          <li>
            위 목록에 없는 프린터는 제거해야 합니다:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>제거할 프린터에 마우스 오른쪽 버튼을 클릭합니다.</li>
              <li>장치 제거 메뉴를 선택합니다.</li>
              <li>확인 메시지가 표시되면 예를 클릭합니다.</li>
              <li>필요에 따라 관리자 권한을 요구할 수 있습니다.</li>
            </ol>
          </li>
          <li>제거 후 시스템을 재부팅하여 변경사항을 적용합니다.</li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">예외 사항</h2>
        <p>
          업무에 필수적으로 사용해야 하는 프린터가 있는 경우, 운영심(2533)으로
          문의하여 예외 승인을 받을 수 있습니다.
        </p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}