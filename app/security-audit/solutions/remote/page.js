// app/security-audit/solutions/remote-access/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function RemoteAccessPolicyPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">원격접속 통제 확인</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          원격 접속은 사용자가 외부에서 내부 네트워크 자원에 접근할 수 있는 중요한 
          경로이지만, 적절히 통제되지 않으면 보안 위험을 초래할 수 있습니다. 이 페이지에서는 
          원격 데스크톱 및 기타 원격 접속 서비스의 올바른 통제 방법을 안내합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">원격접속 통제 정책 요구사항</h2>
        <p>다음 원격접속 통제 정책이 반드시 적용되어 있어야 합니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>승인된 사용자 제한:</strong> 업무상 필요한 인가된 사용자만 원격 접속 가능
          </li>
          <li>
            <strong>IP 주소 기반 제한:</strong> 특정 승인된 IP 주소 또는 IP 범위에서만 접속 허용
          </li>
          <li>
            <strong>다중 인증:</strong> 가능한 경우 2단계 인증 적용
          </li>
          <li>
            <strong>접속 로깅:</strong> 모든 원격 접속 시도 및 활동 기록
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">원격 데스크톱 설정 확인 방법 (Windows)</h2>
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
              <li>"이 컴퓨터에 대한 원격 지원 연결 허용" 설정이 필요에 따라 적절히 구성되어 있는지 확인합니다.</li>
              <li>"원격 데스크톱" 섹션에서 "이 컴퓨터에 대한 원격 연결 허용" 설정이 필요에 따라 적절히 구성되어 있는지 확인합니다.</li>
            </ol>
          </li>
          <li>
            원격 데스크톱 사용자 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>원격 탭의 "원격 데스크톱" 섹션에서 "사용자 선택" 버튼을 클릭합니다.</li>
              <li>원격 데스크톱 사용자 창에서 승인된 사용자만 목록에 있는지 확인합니다.</li>
              <li>승인되지 않은 사용자가 있다면 제거합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">원격 데스크톱 고급 설정 구성</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            그룹 정책을 통한 원격 데스크톱 설정:
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
        <h2 className="section-title">명령줄을 통한 원격 데스크톱 설정 확인</h2>
        <p>다음 명령을 사용하여 원격 데스크톱 설정을 확인할 수 있습니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>reg query "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections</code>
        </div>
        
        <p>
          결과값이 0이면 원격 데스크톱이 활성화된 것이고, 1이면 비활성화된 것입니다.
        </p>
        
        <p>원격 데스크톱 포트 확인:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>reg query "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v PortNumber</code>
        </div>
        
        <p>PowerShell을 사용하여 원격 데스크톱 설정 확인:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>Get-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections"</code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">원격 접속 보안 모범 사례</h2>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>기본 RDP 포트(3389)를 비표준 포트로 변경하여 무차별 대입 공격 위험 감소</li>
          <li>원격 데스크톱 연결에 항상 강력한 비밀번호 사용</li>
          <li>계정 잠금 정책 적용(여러 번의 로그인 실패 후 계정 잠금)</li>
          <li>VPN을 통해서만 원격 데스크톱 액세스 허용 고려</li>
          <li>최신 RDP 클라이언트 및 서버 패치 적용</li>
          <li>원격 데스크톱 게이트웨이 사용 고려</li>
          <li>원격 데스크톱 활동 로그 정기적 검토</li>
        </ul>
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
          <li>
            감사 정책 구성:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>그룹 정책 편집기에서 "컴퓨터 구성" → "Windows 설정" → "보안 설정" → "로컬 정책" → "감사 정책"으로 이동합니다.</li>
              <li>"계정 로그온 이벤트 감사" 및 "로그온 이벤트 감사"를 "성공 및 실패"로 설정합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          원격 접속 보안 정책 설정이나 확인에 문제가 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안관리팀: 내선 1234 또는 security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}