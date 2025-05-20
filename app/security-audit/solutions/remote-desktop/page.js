// app/security-audit/solutions/remote-desktop/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function RemoteDesktopPolicyPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">원격데스크톱 제한 확인</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          원격 데스크톱 서비스는 사용자가 다른 컴퓨터에 원격으로 접속할 수 있게 해주는 
          유용한 도구이지만, 보안 위험을 초래할 수 있습니다. 승인되지 않은 원격 접속은 
          시스템 침해와 데이터 유출로 이어질 수 있으므로, 원격 데스크톱 서비스를 적절히 
          제한하고 관리하는 것이 중요합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">원격데스크톱 제한 정책 요구사항</h2>
        <p>다음 원격데스크톱 제한 정책이 반드시 적용되어 있어야 합니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>원격 데스크톱 비활성화:</strong> 특별히 필요하지 않는 한 원격 데스크톱 서비스가 비활성화되어야 함
          </li>
          <li>
            <strong>승인된 사용자 제한:</strong> 원격 데스크톱이 필요한 경우, 승인된 사용자에게만 접근 권한을 부여해야 함
          </li>
          <li>
            <strong>강력한 인증 설정:</strong> 원격 접속 시 네트워크 수준 인증(NLA)을 요구해야 함
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">원격데스크톱 설정 확인 방법 (Windows)</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            원격 데스크톱 설정 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows + R 키를 눌러 실행 창을 엽니다.</li>
              <li>sysdm.cpl을 입력하고 확인을 클릭합니다.</li>
              <li>시스템 속성 창에서 "원격" 탭을 클릭합니다.</li>
              <li>"원격 데스크톱" 섹션에서 "이 컴퓨터에 대한 원격 연결 허용" 체크박스가 선택되어 있지 않아야 합니다.</li>
            </ol>
          </li>
          <li>
            승인된 사용자 확인(원격 데스크톱이 필요한 경우):
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>원격 탭의 "원격 데스크톱" 섹션에서 "사용자 선택" 버튼을 클릭합니다.</li>
              <li>목록에 승인된 사용자만 있는지 확인합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">명령줄을 통한 원격데스크톱 설정 확인</h2>
        <p>다음 명령을 사용하여 원격 데스크톱 설정을 확인할 수 있습니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>reg query "HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections</code>
        </div>
        
        <p>
          결과값이 1이면 원격 데스크톱이 비활성화된 것이고, 0이면 활성화된 것입니다. 보안을 위해서는 값이 1이어야 합니다.
        </p>
        
        <p>PowerShell을 사용하여 원격 데스크톱 설정 확인:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>Get-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name "fDenyTSConnections"</code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">원격데스크톱 비활성화 방법</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            시스템 속성을 통한 비활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>시스템 속성 창의 "원격" 탭에서 "이 컴퓨터에 대한 원격 연결 허용" 체크박스의 선택을 해제합니다.</li>
              <li>"확인"을 클릭하여 변경사항을 저장합니다.</li>
            </ol>
          </li>
          <li>
            레지스트리를 통한 비활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>관리자 권한으로 명령 프롬프트를 실행합니다.</li>
              <li>다음 명령을 입력합니다:</li>
            </ol>
          </li>
        </ol>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>reg add "HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 1 /f</code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">원격데스크톱 보안 모범 사례 (원격 접속이 필요한 경우)</h2>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>가능하면 원격 데스크톱 대신 VPN과 같은 보다 안전한 원격 접속 방법 사용</li>
          <li>기본 RDP 포트(3389)를 비표준 포트로 변경하여 무차별 대입 공격 위험 감소</li>
          <li>원격 데스크톱 접속에 네트워크 수준 인증(NLA) 요구</li>
          <li>강력한 패스워드와 계정 잠금 정책 적용</li>
          <li>승인된 IP 주소에서만 접속 허용하도록 방화벽 규칙 설정</li>
          <li>원격 데스크톱 게이트웨이 또는 원격 데스크톱 서비스 배포</li>
          <li>정기적으로 원격 데스크톱 로그 확인</li>
          <li>최신 보안 업데이트 및 패치 적용</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">원격 데스크톱 고급 보안 설정 (관리자용)</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            그룹 정책을 통한 원격 데스크톱 보안 강화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows + R 키를 눌러 실행 창을 엽니다.</li>
              <li>gpedit.msc를 입력하고 확인을 클릭합니다.</li>
              <li>컴퓨터 구성 → 관리 템플릿 → Windows 구성 요소 → 원격 데스크톱 서비스 → 원격 데스크톱 세션 호스트 → 보안으로 이동합니다.</li>
              <li>"원격(RDP) 연결에 네트워크 수준 인증을 사용하도록 요구" 정책을 "사용"으로 설정합니다.</li>
              <li>"항상 원격 데스크톱 연결을 위해 지정된 보안 계층을 사용" 정책을 "사용"으로 설정하고 보안 계층을 "SSL(TLS 1.0)" 이상으로 설정합니다.</li>
            </ol>
          </li>
          <li>
            Windows 방화벽을 통한 원격 데스크톱 액세스 제한:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows + R 키를 눌러 실행 창을 엽니다.</li>
              <li>wf.msc를 입력하고 확인을 클릭합니다.</li>
              <li>왼쪽 창에서 "인바운드 규칙"을 클릭합니다.</li>
              <li>원격 데스크톱 관련 규칙을 찾습니다.</li>
              <li>해당 규칙을 마우스 오른쪽 버튼으로 클릭하고 "속성"을 선택합니다.</li>
              <li>"범위" 탭을 클릭합니다.</li>
              <li>"원격 IP 주소" 섹션에서 "이러한 IP 주소"를 선택하고 승인된 IP 주소 또는 범위를 추가합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">원격 데스크톱 로깅 구성</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            이벤트 뷰어 열기:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows + R 키를 눌러 실행 창을 엽니다.</li>
              <li>eventvwr.msc를 입력하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            원격 데스크톱 로그 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>왼쪽 창에서 "Windows 로그" → "보안"으로 이동합니다.</li>
              <li>이벤트 ID 4624, 4625, 4634를 찾아 원격 데스크톱 로그인 및 로그아웃 이벤트를 확인합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          원격 데스크톱 설정에 문제가 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안관리팀: 내선 1234 또는 security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}