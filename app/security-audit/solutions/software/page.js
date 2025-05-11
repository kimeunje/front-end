// app/security-audit/solutions/software/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function SoftwareRemovalPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">불필요한 소프트웨어 제거</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          시스템에 설치된 불필요한 소프트웨어는 보안 취약점의 원인이 될 수 있습니다.
          이 페이지에서는 불필요한 소프트웨어를 식별하고 안전하게 제거하는 방법을 안내합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">보안 위험</h2>
        <p>
          승인되지 않거나 불필요한 소프트웨어가 설치되어 있을 경우 다음과 같은 보안 위험이
          있습니다:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>알려진 취약점을 통한 공격 표면 증가</li>
          <li>업데이트되지 않은 오래된 소프트웨어로 인한 취약점 노출</li>
          <li>악성 소프트웨어의 은닉 및 실행 환경 제공</li>
          <li>승인되지 않은 데이터 접근 및 유출 가능성</li>
          <li>시스템 자원 낭비 및 성능 저하</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">불필요한 소프트웨어 식별 방법</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            설치된 프로그램 목록 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows 시작 메뉴 → 설정 → 앱 → 설치된 앱으로 이동합니다.</li>
              <li>설치된 모든 소프트웨어를 확인합니다.</li>
            </ol>
          </li>
          <li>
            다음 프로그램들은 일반적으로 필요하지 않으며 제거를 고려해야 합니다:
            <ul
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "circle",
              }}
            >
              <li>제조업체가 사전 설치한 블로트웨어(Bloatware)</li>
              <li>오래된 버전의 Java Runtime Environment(JRE)</li>
              <li>사용하지 않는 도구 모음(toolbars) 및 브라우저 확장 프로그램</li>
              <li>사용하지 않는 게임 및 엔터테인먼트 소프트웨어</li>
              <li>오래된 미디어 플레이어 및 코덱</li>
              <li>승인되지 않은 파일 공유 애플리케이션</li>
              <li>지원 종료된 소프트웨어</li>
            </ul>
          </li>
          <li>
            승인된 소프트웨어 목록은 다음과 같습니다:
            <ul
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "circle",
              }}
            >
              <li>Microsoft Office 제품군(최신 버전)</li>
              <li>기업 표준 브라우저(Chrome Enterprise, Edge)</li>
              <li>승인된 보안 솔루션</li>
              <li>업무용 필수 애플리케이션(SAP, Oracle 등)</li>
              <li>VPN 클라이언트</li>
              <li>원격 지원 도구(TeamViewer, AnyDesk 등 - IT 부서 승인 필요)</li>
            </ul>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">소프트웨어 제거 방법</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            Windows 설정을 통한 제거:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows 시작 메뉴 → 설정 → 앱 → 설치된 앱으로 이동합니다.</li>
              <li>제거할 앱을 찾아 선택합니다.</li>
              <li>제거 버튼을 클릭합니다.</li>
              <li>확인 메시지가 표시되면 예를 클릭합니다.</li>
            </ol>
          </li>
          <li>
            제어판을 통한 제거:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows 검색창에서 제어판을 검색하여 실행합니다.</li>
              <li>프로그램 제거를 클릭합니다.</li>
              <li>제거할 프로그램을 선택합니다.</li>
              <li>제거 또는 변경 버튼을 클릭합니다.</li>
              <li>화면의 지시에 따라 제거 과정을 완료합니다.</li>
            </ol>
          </li>
          <li>
            제거 후 시스템을 재부팅하여 변경사항을 완전히 적용합니다.
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">소프트웨어 제거 시 주의사항</h2>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            확실하지 않은 소프트웨어는 제거하기 전에 IT 부서에 문의하세요.
          </li>
          <li>
            시스템 구성 요소로 표시된 프로그램은 제거하지 마세요.
          </li>
          <li>
            장치 드라이버 관련 소프트웨어는 신중히 다루어야 합니다.
          </li>
          <li>
            제거 전에 중요한 데이터 백업을 확인하세요.
          </li>
          <li>
            한 번에 여러 개의 프로그램을 제거하지 말고, 한 번에 하나씩 제거하세요.
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">소프트웨어 설치 승인 절차</h2>
        <p>
          새로운 소프트웨어 설치가 필요한 경우 다음 절차를 따르세요:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>소프트웨어 설치 요청서를 작성합니다.</li>
          <li>
            필요성 및 사용 목적을 명확히 기술합니다.
          </li>
          <li>
            IT 보안팀의 검토 및 승인을 받습니다.
          </li>
          <li>
            승인 후 IT 지원팀에 설치를 요청하거나, 자체 설치 권한이 있는 경우 
            승인된 소프트웨어 저장소에서 다운로드하여 설치합니다.
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          소프트웨어 제거에 문제가 있거나 특정 소프트웨어의 필요성에 대한 문의가 있는 경우 
          아래 담당자에게 연락하세요:
        </p>
        <p>IT 지원팀: 내선 4567 또는 it-support@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}