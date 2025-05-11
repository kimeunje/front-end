// app/security-audit/solutions/firewall/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function FirewallSettingsPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">방화벽 설정 강화</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          방화벽은 네트워크 보안의 핵심 구성 요소입니다. 이 페이지에서는 Windows 방화벽 
          설정을 강화하여 시스템 보안을 향상시키는 방법을 안내합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">방화벽 활성화 확인</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            Windows 방화벽 상태 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>시작 메뉴 → Windows 보안 → 방화벽 및 네트워크 보호로 이동합니다.</li>
              <li>
                도메인 네트워크, 개인 네트워크, 공용 네트워크 항목이 모두 '켜짐' 상태인지 
                확인합니다.
              </li>
            </ol>
          </li>
          <li>
            명령 프롬프트를 통한 확인(관리자 권한 필요):
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>명령 프롬프트를 관리자 권한으로 실행합니다.</li>
              <li>
                <code>netsh advfirewall show allprofiles</code> 명령을 실행합니다.
              </li>
              <li>
                모든 프로필(도메인, 개인, 공용)의 '상태'가 '켜짐'으로 표시되어야 합니다.
              </li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">방화벽 활성화 방법</h2>
        <p>
          방화벽이 비활성화된 경우 다음 단계에 따라 활성화하세요:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            GUI를 통한 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>시작 메뉴 → Windows 보안 → 방화벽 및 네트워크 보호로 이동합니다.</li>
              <li>비활성화된 네트워크 프로필을 클릭합니다.</li>
              <li>Microsoft Defender 방화벽 토글 버튼을 '켜짐'으로 설정합니다.</li>
            </ol>
          </li>
          <li>
            명령 프롬프트를 통한 활성화(관리자 권한 필요):
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>명령 프롬프트를 관리자 권한으로 실행합니다.</li>
              <li>
                모든 프로필 활성화: <code>netsh advfirewall set allprofiles state on</code>
              </li>
              <li>
                특정 프로필 활성화: <code>netsh advfirewall set currentprofile state on</code>
              </li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">방화벽 규칙 관리</h2>
        <p>
          기본 방화벽 규칙 외에도 추가적인 보안을 위해 다음 설정을 구성하세요:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            고급 보안이 포함된 Windows Defender 방화벽 열기:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                시작 메뉴에서 "Windows Defender 방화벽" 검색 → "고급 보안이 포함된 Windows Defender 방화벽" 선택
              </li>
            </ol>
          </li>
          <li>
            인바운드 규칙 검토 및 구성:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>왼쪽 패널에서 "인바운드 규칙"을 선택합니다.</li>
              <li>
                사용하지 않는 서비스나 포트에 대한 인바운드 규칙은 비활성화하세요.
              </li>
              <li>
                특히 다음 서비스에 대한 불필요한 인바운드 연결을 차단하세요:
                <ul
                  style={{
                    marginLeft: "20px",
                    marginTop: "5px",
                    listStyleType: "disc",
                  }}
                >
                  <li>원격 데스크톱(필요한 경우에만 특정 IP에서만 허용)</li>
                  <li>파일 및 프린터 공유(업무상 필요한 경우에만 허용)</li>
                  <li>SMB 프로토콜(포트 445)</li>
                  <li>원격 레지스트리</li>
                </ul>
              </li>
            </ol>
          </li>
          <li>
            아웃바운드 규칙 구성:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>왼쪽 패널에서 "아웃바운드 규칙"을 선택합니다.</li>
              <li>
                기본적으로 아웃바운드 연결은 허용되지만, 보안 강화를 위해 더 
                제한적인 정책을 적용하세요.
              </li>
              <li>
                특히 승인되지 않은 응용 프로그램이 외부 네트워크에 연결하지 못하도록
                제한하는 규칙을 추가하세요.
              </li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">방화벽 로깅 활성화</h2>
        <p>
          방화벽 활동을 모니터링하기 위해 로깅을 활성화하세요:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            고급 보안이 포함된 Windows Defender 방화벽에서 좌측 패널의 
            "Windows Defender 방화벽 속성"을 선택합니다.
          </li>
          <li>
            도메인 프로필, 개인 프로필, 공용 프로필 탭에서 각각:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"로깅" 섹션으로 이동합니다.</li>
              <li>"로그 파일 이름과 경로"를 확인합니다. (기본값: %systemroot%\system32\LogFiles\Firewall\pfirewall.log)</li>
              <li>"차단된 연결 기록"을 "예"로 설정합니다.</li>
              <li>"성공한 연결 기록"을 "예"로 설정합니다.</li>
              <li>"로그 파일 최대 크기(KB)"를 '4096' 이상으로 설정합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">방화벽 알림 설정</h2>
        <p>
          방화벽에 의해 차단된 프로그램을 모니터링하기 위한 알림 설정:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            각 네트워크 프로필(도메인, 개인, 공용)에 대해:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"Windows Defender 방화벽 속성"에서 해당 프로필 탭을 선택합니다.</li>
              <li>"설정" 섹션에서 "Windows에서 앱이 방화벽을 통해 통신하는 것을 차단할 때 알림 표시"를 "예"로 설정합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">권장 방화벽 설정</h2>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>기본 동작 설정:</strong>
            <ul
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "circle",
              }}
            >
              <li>인바운드 연결: "차단"으로 설정</li>
              <li>아웃바운드 연결: "필요한 경우 차단"으로 설정</li>
            </ul>
          </li>
          <li>
            <strong>방화벽 프로필별 설정:</strong>
            <ul
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "circle",
              }}
            >
              <li>공용 네트워크: 가장 엄격한 규칙 적용(카페, 공항 등의 공공 Wi-Fi)</li>
              <li>개인 네트워크: 중간 수준의 규칙 적용(가정 네트워크)</li>
              <li>도메인 네트워크: 회사 정책에 따른 규칙 적용(회사 네트워크)</li>
            </ul>
          </li>
          <li>
            <strong>Windows 방화벽 그룹 정책 설정:</strong>
            <ul
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "circle",
              }}
            >
              <li>도메인 환경에서는 그룹 정책을 통해 중앙에서 방화벽 설정을 관리합니다.</li>
              <li>로컬 방화벽 설정 변경을 사용자가 할 수 없도록 제한합니다.</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">방화벽 규칙 정기 검토</h2>
        <p>
          다음 일정에 따라 방화벽 규칙을 정기적으로 검토하고 업데이트하세요:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            월간 검토: 필요하지 않은 규칙 비활성화 또는 제거
          </li>
          <li>
            분기별 검토: 모든 방화벽 규칙의 포괄적인 평가 및 정리
          </li>
          <li>
            정책 변경 시: 새로운 보안 정책이나 요구사항에 따라 방화벽 규칙 조정
          </li>
          <li>
            애플리케이션 변경 시: 새로운 애플리케이션 도입 또는 기존 애플리케이션 제거 시 관련 규칙 조정
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">추가 보안 강화 조치</h2>
        <p>방화벽 보안을 더욱 강화하기 위한 추가 조치:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            네트워크 세분화: 중요한 시스템이나 데이터에 대한 접근을 제한하기 위해 네트워크를 세분화합니다.
          </li>
          <li>
            애플리케이션 제어: 승인된 애플리케이션만 실행할 수 있도록 애플리케이션 제어 정책을 구현합니다.
          </li>
          <li>
            침입 탐지/방지 시스템(IDS/IPS): 방화벽과 함께 IDS/IPS를 구현하여 네트워크 트래픽을 모니터링하고 
            잠재적인 공격을 탐지합니다.
          </li>
          <li>
            VPN 사용: 원격 접속 시 항상 VPN을 사용하여 통신을 암호화합니다.
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          방화벽 설정에 문제가 있거나 특정 애플리케이션을 위한 방화벽 규칙 생성이 필요한 경우 
          아래 담당자에게 문의하세요:
        </p>
        <p>네트워크 보안팀: 내선 3456 또는 network-security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}