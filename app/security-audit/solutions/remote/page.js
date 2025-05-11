// app/security-audit/solutions/remote/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function RemoteDesktopPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">원격 데스크톱 설정</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          원격 데스크톱은 물리적으로 떨어진 컴퓨터에 접속하여 작업할 수 있는 유용한 기능이지만,
          부적절하게 구성된 경우 심각한 보안 위험을 초래할 수 있습니다. 이 페이지에서는
          원격 데스크톱 서비스의 안전한 구성 및 사용 방법을 안내합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">원격 데스크톱 보안 위험</h2>
        <p>
          원격 데스크톱과 관련된 주요 보안 위험:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>무차별 대입 공격(Brute Force Attack):</strong> 약한 비밀번호를 사용할 경우
            공격자가 지속적인 로그인 시도를 통해 접근 권한을 획득할 수 있습니다.
          </li>
          <li>
            <strong>중간자 공격(Man-in-the-Middle):</strong> 암호화되지 않은 RDP 연결은
            공격자가 세션을 가로채 정보를 유출할 수 있습니다.
          </li>
          <li>
            <strong>원격 코드 실행 취약점:</strong> 패치되지 않은 RDP 서비스는 원격 코드 실행
            취약점(예: BlueKeep)에 노출될 수 있습니다.
          </li>
          <li>
            <strong>인증 우회:</strong> 잘못 구성된 RDP 설정은 인증 메커니즘을 우회할 수 있는
            취약점을 노출할 수 있습니다.
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">원격 데스크톱 활성화 상태 확인</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            Windows 원격 데스크톱 활성화 상태 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>시작 메뉴 → '설정' → '시스템' → '원격 데스크톱'으로 이동합니다.</li>
              <li>'이 컴퓨터에 대한 원격 데스크톱 사용' 설정의 상태를 확인합니다.</li>
            </ol>
          </li>
          <li>
            명령 프롬프트를 통한 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>명령 프롬프트를 관리자 권한으로 실행합니다.</li>
              <li><code>systeminfo | findstr "원격 데스크톱"</code> 명령을 실행합니다.</li>
              <li>또는 영문 Windows의 경우: <code>systeminfo | findstr "Remote Desktop"</code></li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">안전한 원격 데스크톱 구성</h2>
        <p>
          원격 데스크톱 서비스의 안전한 구성을 위한 단계별 지침:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            필요한 경우에만 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>원격 접속이 필요한 시스템에만 원격 데스크톱을 활성화합니다.</li>
              <li>사용하지 않을 때는 원격 데스크톱을 비활성화합니다.</li>
            </ol>
          </li>
          <li>
            최신 버전 사용:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                운영 체제와 RDP 클라이언트를 최신 버전으로 유지하여 알려진 취약점을 패치합니다.
              </li>
              <li>
                Windows 업데이트를 통해 정기적으로 패치를 적용합니다.
              </li>
            </ol>
          </li>
          <li>
            네트워크 수준 인증(NLA) 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                시스템 속성 → 원격 탭 → "다음 사용자만 연결 허용" 옵션에서
                "네트워크 수준 인증을 사용하여 원격 데스크톱이 있는 컴퓨터에서만 연결 허용"을
                선택합니다.
              </li>
            </ol>
          </li>
          <li>
            강력한 암호 정책 적용:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>원격 접속이 허용된 모든 계정에 강력한 암호를 설정합니다.</li>
              <li>계정 잠금 정책을 구성하여 연속된 로그인 실패 시 계정을 잠급니다.</li>
            </ol>
          </li>
          <li>
            제한적 사용자 접근 권한:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                원격 데스크톱 사용자 그룹에 필요한 사용자만 추가합니다.
              </li>
              <li>
                관리자 그룹의 원격 접속 권한을 제한하고, 필요한 경우에만 일시적으로 허용합니다.
              </li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">고급 보안 설정</h2>
        <p>
          추가적인 원격 데스크톱 보안 강화 방법:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            비표준 포트 사용:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                기본 RDP 포트(3389)가 아닌 다른 포트를 사용하여 자동화된 스캔을 피합니다.
              </li>
              <li>
                포트 변경 방법:
                <ol
                  style={{
                    marginLeft: "20px",
                    marginTop: "5px",
                    listStyleType: "lower-roman",
                  }}
                >
                  <li>레지스트리 편집기(regedit)를 실행합니다.</li>
                  <li>
                    HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp으로 이동합니다.
                  </li>
                  <li>"PortNumber" 값을 수정하여 새 포트 번호를 설정합니다.</li>
                  <li>방화벽에서 새 포트를 허용하고 기존 3389 포트를 차단합니다.</li>
                  <li>시스템을 재부팅합니다.</li>
                </ol>
              </li>
            </ol>
          </li>
          <li>
            IP 기반 제한:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                Windows 방화벽을 구성하여 특정 IP 주소 또는 범위에서만 RDP 접속을 허용합니다.
              </li>
              <li>
                명령 프롬프트(관리자 권한)에서 실행:
                <div
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "4px",
                    marginTop: "5px",
                    fontFamily: "monospace",
                  }}
                >
                  <code>
                    netsh advfirewall firewall add rule name="Remote Desktop - Allowed IPs" dir=in action=allow protocol=TCP localport=3389 remoteip=192.168.1.0/24
                  </code>
                </div>
              </li>
            </ol>
          </li>
          <li>
            다단계 인증(MFA) 구현:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                Azure MFA, Duo Security 또는 기타 MFA 솔루션을 구현하여 원격 데스크톱 접속에
                추가 인증 계층을 적용합니다.
              </li>
            </ol>
          </li>
          <li>
            세션 타임아웃 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>그룹 정책 편집기(gpedit.msc)를 실행합니다.</li>
              <li>
                컴퓨터 구성 → 관리 템플릿 → Windows 구성 요소 → 원격 데스크톱 서비스 →
                원격 데스크톱 세션 호스트 → 세션 시간 제한으로 이동합니다.
              </li>
              <li>"유휴 세션 제한 시간 설정"을 구성하여 적절한 시간(예: 15분)을 설정합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">RDP 대안 및 보완 솔루션</h2>
        <p>
          원격 데스크톱 프로토콜(RDP)의 대안 또는 보완 솔루션:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>VPN을 통한 RDP 접속:</strong> 직접 RDP 포트를 인터넷에 노출하는 대신,
            VPN을 통해 접속한 후 내부 네트워크에서 RDP를 사용합니다.
          </li>
          <li>
            <strong>원격 데스크톱 게이트웨이:</strong> 중간에 중개 서버를 두어 보안을 강화하고
            모든 연결을 HTTPS로 암호화합니다.
          </li>
          <li>
            <strong>점프 서버(Bastion Host):</strong> 네트워크 경계에 위치한 강화된 서버를 통해
            내부 시스템에 접근합니다.
          </li>
          <li>
            <strong>보안 원격 접속 솔루션:</strong> TeamViewer, AnyDesk 등의 상용 솔루션을
            고려할 수 있으나, 회사 보안 정책에 부합하는지 확인해야 합니다.
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">원격 데스크톱 모니터링</h2>
        <p>
          원격 데스크톱 활동 모니터링 및 로깅:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            이벤트 로그 감사 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>그룹 정책 편집기(gpedit.msc)를 실행합니다.</li>
              <li>
                컴퓨터 구성 → Windows 설정 → 보안 설정 → 로컬 정책 → 감사 정책으로 이동합니다.
              </li>
              <li>"로그온 이벤트 감사"와 "계정 로그온 이벤트 감사"를 "성공 및 실패"로 설정합니다.</li>
            </ol>
          </li>
          <li>
            이벤트 로그 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>이벤트 뷰어(eventvwr.msc)를 실행합니다.</li>
              <li>Windows 로그 → 보안으로 이동합니다.</li>
              <li>
                이벤트 ID 4624(성공한 로그온), 4625(실패한 로그온), 4634(로그오프)를 필터링하여
                원격 데스크톱 접속 활동을 확인합니다.
              </li>
            </ol>
          </li>
          <li>
            중앙 집중식 로깅:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                Syslog 서버 또는 SIEM(보안 정보 및 이벤트 관리) 시스템을 구축하여
                모든 원격 데스크톱 활동 로그를 중앙에서 수집하고 분석합니다.
              </li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">원격 데스크톱 접속 절차</h2>
        <p>
          안전한 원격 데스크톱 접속을 위한 사용자 절차:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            접속 전 준비:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>접속하려는 컴퓨터의 호스트명 또는 IP 주소를 확인합니다.</li>
              <li>접속 권한이 있는 계정 정보를 준비합니다.</li>
              <li>사용 중인 원격 데스크톱 클라이언트가 최신 버전인지 확인합니다.</li>
            </ol>
          </li>
          <li>
            안전한 접속 방법:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>가능하면 VPN을 통해 회사 네트워크에 먼저 연결합니다.</li>
              <li>원격 데스크톱 연결 클라이언트를 실행합니다.</li>
              <li>
                고급 설정에서 "보안 계층에 네트워크 수준 인증 사용" 옵션이 활성화되어 있는지 확인합니다.
              </li>
              <li>
                호스트명 또는 IP 주소를 입력하고, 필요한 경우 포트 번호를 지정합니다(예: 192.168.1.100:3389).
              </li>
            </ol>
          </li>
          <li>
            세션 중 보안 관리:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>원격 세션에서 작업을 마치면 반드시 로그오프합니다.</li>
              <li>사용하지 않는 원격 세션을 열어두지 않습니다.</li>
              <li>
                민감한 정보 작업 후에는 임시 파일, 클립보드 내용 등을 정리합니다.
              </li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">원격 데스크톱 보안 점검</h2>
        <p>
          정기적인 원격 데스크톱 보안 점검 항목:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            모든 Windows 업데이트가 적용되었는지 확인
          </li>
          <li>
            네트워크 수준 인증(NLA)이 활성화되어 있는지 확인
          </li>
          <li>
            권한이 있는 사용자만 원격 데스크톱 사용자 그룹에 포함되어 있는지 확인
          </li>
          <li>
            원격 데스크톱 이벤트 로그를 검토하여 의심스러운 활동이 있는지 확인
          </li>
          <li>
            방화벽 규칙이 제대로 구성되어 있는지 확인
          </li>
          <li>
            패스워드 정책이 적절히 적용되어 있는지 확인
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          원격 데스크톱 설정 관련 문의가 있는 경우 아래 담당자에게 연락하세요:
        </p>
        <p>시스템 관리팀: 내선 3456 또는 system-admin@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}