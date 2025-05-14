// app/security-audit/solutions/printer/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function PrinterPolicyPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">미승인 프린터 점검</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          승인되지 않은 프린터 장치는 정보 유출의 주요 경로가 될 수 있습니다. 
          조직 내 모든 프린터는 적절히 관리되고 승인된 장치만 사용해야 합니다.
          이 페이지에서는 미승인 프린터 점검 방법과 승인된 프린터 관리 방안을 안내합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">프린터 보안 정책 요구사항</h2>
        <p>다음 프린터 보안 정책이 반드시 적용되어 있어야 합니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>승인된 프린터만 사용:</strong> IT부서에서 승인한 프린터만 사용해야 함
          </li>
          <li>
            <strong>개인 프린터 금지:</strong> 개인용 프린터 연결 및 사용 금지
          </li>
          <li>
            <strong>프린터 로그 활성화:</strong> 모든 인쇄 작업에 대한 로깅 활성화
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">프린터 점검 방법 (Windows)</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            현재 설치된 프린터 목록 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows + R 키를 눌러 실행 창을 엽니다.</li>
              <li>control printers를 입력하고 확인을 클릭합니다.</li>
              <li>프린터 및 스캐너 창에서 설치된 모든 프린터 장치를 확인할 수 있습니다.</li>
            </ol>
          </li>
          <li>
            미승인 프린터 제거:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>프린터 목록에서 승인되지 않은 프린터를 선택합니다.</li>
              <li>마우스 오른쪽 버튼으로 클릭하고 "장치 제거"를 선택합니다.</li>
              <li>확인을 클릭하여 제거를 완료합니다.</li>
            </ol>
          </li>
          <li>
            프린터 포트 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>프린터 창에서 아무 프린터나 선택합니다.</li>
              <li>"프린터 서버 속성"을 클릭합니다(상단 메뉴에서 찾을 수 있음).</li>
              <li>"포트" 탭을 클릭하여 모든 프린터 포트를 확인합니다.</li>
              <li>승인되지 않은 USB 또는 로컬 포트가 있는지 확인합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">명령줄을 통한 프린터 확인</h2>
        <p>다음 PowerShell 명령을 사용하여 현재 시스템의 모든 프린터 목록을 확인할 수 있습니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>Get-Printer | Format-Table -Property Name, Type, PortName, DriverName</code>
        </div>
        
        <p>
          로컬 USB 연결 프린터를 확인하려면 다음 명령어를 사용합니다:
        </p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>Get-Printer | Where-Object &#123;$_.Type -eq "Local"&#125; | Format-Table -Property Name, DriverName</code>
        </div>
        
        <p>명령 프롬프트에서 다음 명령을 사용할 수도 있습니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>wmic printer list brief</code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">그룹 정책을 통한 프린터 통제 (관리자용)</h2>
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
            프린터 설치 제한 정책 위치로 이동:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                컴퓨터 구성 → 관리 템플릿 → 프린터로 이동합니다.
              </li>
            </ol>
          </li>
          <li>
            로컬 프린터 연결 제한:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"로컬 프린터 연결 허용 안 함" 정책을 더블 클릭합니다.</li>
              <li>"사용" 옵션을 선택하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            USB 프린터 연결 제한:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"사용자가 USB 프린터를 직접 설치하지 못하도록 방지" 정책을 더블 클릭합니다.</li>
              <li>"사용" 옵션을 선택하고 확인을 클릭합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">프린터 보안 모범 사례</h2>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>모든 네트워크 프린터는 최신 펌웨어로 업데이트해야 합니다.</li>
          <li>프린터 관리 인터페이스에 강력한 암호를 설정해야 합니다.</li>
          <li>사용하지 않는 프린터 프로토콜 및 서비스는 비활성화해야 합니다.</li>
          <li>가능한 경우 인쇄 작업은 암호화해야 합니다.</li>
          <li>정기적으로 프린터 로그를 검토하여 비정상적인 활동을 모니터링해야 합니다.</li>
          <li>중요 문서 인쇄 시 보안 인쇄 기능(PIN 입력 후 출력)을 사용합니다.</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">정기적인 프린터 점검 절차</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>월 1회 이상 시스템에 설치된 모든 프린터 목록을 확인합니다.</li>
          <li>승인된 프린터 목록과 비교하여 승인되지 않은 프린터를 식별합니다.</li>
          <li>승인되지 않은 프린터 발견 시 즉시 제거하고 보안 담당자에게 보고합니다.</li>
          <li>네트워크 스캔을 통해 네트워크에 연결된 모든 프린터 장치를 확인합니다.</li>
          <li>모든 프린터의 펌웨어 버전을 확인하고 필요한 경우 업데이트합니다.</li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          프린터 보안 정책 설정이나 확인에 문제가 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안관리팀: 내선 1234 또는 security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}