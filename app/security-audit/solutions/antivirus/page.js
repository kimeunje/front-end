// app/security-audit/solutions/antivirus/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function AntivirusCheckPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">백신 상태 확인</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          백신 프로그램은 악성 소프트웨어로부터 시스템을 보호하는 중요한 보안 도구입니다.
          백신이 제대로 설치되어 있고, 실시간 보호 기능이 활성화되어 있으며, 최신 업데이트가
          적용되어 있어야 효과적인 보안 체계를 유지할 수 있습니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">백신 상태 요구사항</h2>
        <p>다음 백신 상태 요구사항이 반드시 충족되어야 합니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>승인된 백신 사용:</strong> 조직에서 승인한 백신 프로그램(알약, AhnLab, V3 등)이 설치되어 있어야 함
          </li>
          <li>
            <strong>실시간 보호 활성화:</strong> 백신의 실시간 보호 기능이 활성화되어 있어야 함
          </li>
          <li>
            <strong>최신 업데이트 적용:</strong> 백신 프로그램 및 바이러스 정의 파일이 최신 상태여야 함
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">백신 상태 확인 방법 (Windows)</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            알약/AhnLab 백신 상태 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>시스템 트레이(화면 오른쪽 하단)에서 알약/AhnLab 아이콘을 찾습니다.</li>
              <li>아이콘을 더블 클릭하여 백신 프로그램을 엽니다.</li>
              <li>메인 화면에서 실시간 보호 상태를 확인합니다.</li>
              <li>업데이트 상태 및 마지막 업데이트 날짜를 확인합니다.</li>
            </ol>
          </li>
          <li>
            Windows 보안 센터를 통한 백신 상태 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows 설정을 엽니다.</li>
              <li>"업데이트 및 보안" → "Windows 보안"을 클릭합니다.</li>
              <li>"바이러스 및 위협 방지"를 클릭합니다.</li>
              <li>현재 설치된 백신 프로그램과 보호 상태를 확인합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">명령줄을 통한 백신 상태 확인</h2>
        <p>PowerShell을 사용하여 Windows Security Center에 등록된 백신 상태를 확인할 수 있습니다:</p>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntivirusProduct | Format-List DisplayName, ProductState</code>
        </div>

        <p>
          ProductState 값을 해석하려면 다음 PowerShell 스크립트를 사용할 수 있습니다:
        </p>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>
            function Get-AVStatus($productState) &#123;<br />
            &nbsp;&nbsp;$hexString = [Convert]::ToString($productState, 16).PadLeft(6, '0')<br />
            <br />
            &nbsp;&nbsp;$realTimeProtection = 0<br />
            &nbsp;&nbsp;$rtpBit = $hexString.Substring(2, 2)<br />
            <br />
            &nbsp;&nbsp;if ($rtpBit -eq '10') &#123; $realTimeProtection = 1 &#125;<br />
            <br />
            &nbsp;&nbsp;$upToDate = 0<br />
            &nbsp;&nbsp;$updateBit = $hexString.Substring(4, 2)<br />
            <br />
            &nbsp;&nbsp;if ($updateBit -eq '00') &#123; $upToDate = 1 &#125;<br />
            <br />
            &nbsp;&nbsp;return @&#123;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;RealTimeProtection = $realTimeProtection<br />
            &nbsp;&nbsp;&nbsp;&nbsp;UpToDate = $upToDate<br />
            &nbsp;&nbsp;&#125;<br />
            &#125;
          </code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">백신 문제 해결 방법</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            백신 설치 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows 설정 → 앱 → 앱 및 기능에서 알약 또는 AhnLab 제품이 설치되어 있는지 확인합니다.</li>
              <li>설치되지 않은 경우, IT 부서에 연락하여 승인된 백신을 설치 받으세요.</li>
            </ol>
          </li>
          <li>
            실시간 보호 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>백신 프로그램을 열고 설정 또는 환경 설정 메뉴로 이동합니다.</li>
              <li>실시간 보호 또는 실시간 검사 옵션을 찾아 활성화합니다.</li>
            </ol>
          </li>
          <li>
            백신 업데이트:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>백신 프로그램의 업데이트 메뉴로 이동합니다.</li>
              <li>수동 업데이트 버튼을 클릭하여 최신 업데이트를 적용합니다.</li>
              <li>자동 업데이트 설정이 활성화되어 있는지 확인합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">백신 보안 모범 사례</h2>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>매일 자동 업데이트 설정으로 백신을 항상 최신 상태로 유지</li>
          <li>정기적인 전체 시스템 검사 일정 설정 (최소 주 1회)</li>
          <li>백신 프로그램의 설정 변경을 암호로 보호</li>
          <li>의심스러운 파일이나 이메일 첨부 파일을 다운로드하거나 열기 전에 항상 백신으로 검사</li>
          <li>두 개 이상의 백신 프로그램을 동시에 사용하지 않음 (충돌 발생 가능성)</li>
          <li>백신 경고나 알림이 발생하면 즉시 조치</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">그룹 정책을 통한 백신 관리 (관리자용)</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            그룹 정책 편집기 열기:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows + R 키를 눌러 실행 창을 엽니다.</li>
              <li>gpedit.msc를 입력하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            백신 정책 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>컴퓨터 구성 → 관리 템플릿 → Windows 구성 요소 → Windows Defender 바이러스 방지 프로그램으로 이동합니다.</li>
              <li>"실시간 보호 끄기 허용 안 함" 정책을 "사용"으로 설정합니다.</li>
              <li>"보안 인텔리전스 업데이트 끄기 허용 안 함" 정책을 "사용"으로 설정합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          백신 설치나 설정에 문제가 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안관리팀: 내선 1234 또는 security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}