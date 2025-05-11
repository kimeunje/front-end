// app/security-audit/solutions/network/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function NetworkSettingsPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">네트워크 설정</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          안전한 네트워크 구성은 보안의 핵심 요소입니다. 이 페이지에서는 네트워크 설정의
          보안을 강화하는 방법과 안전한 네트워크 관리 방안을 안내합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">무선 네트워크 보안</h2>
        <p>
          무선 네트워크(Wi-Fi)는 특히 보안에 취약할 수 있으므로 다음 설정을 확인하세요:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            무선 라우터 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>라우터 관리 페이지(일반적으로 192.168.0.1 또는 192.168.1.1)에 접속합니다.</li>
              <li>기본 관리자 계정 암호를 강력한 암호로 변경합니다.</li>
              <li>SSID 브로드캐스팅을 비활성화합니다(선택사항).</li>
              <li>WPA3 또는 최소한 WPA2-PSK(AES) 암호화를 사용합니다.</li>
              <li>무선 네트워크 암호를 강력하게 설정하고 정기적으로 변경합니다.</li>
            </ol>
          </li>
          <li>
            게스트 네트워크:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>방문자를 위한 별도의 게스트 네트워크를 구성합니다.</li>
              <li>게스트 네트워크에서 내부 네트워크 접근을 차단합니다.</li>
              <li>게스트 네트워크의 암호를 정기적으로 변경합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">유선 네트워크 보안</h2>
        <p>
          유선 네트워크의 보안을 강화하기 위한 설정:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            스위치 및 라우터 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>모든 네트워크 장비의 기본 암호를 변경합니다.</li>
              <li>
                미사용 포트를 비활성화하거나 VLAN에 할당하여 차단합니다.
              </li>
              <li>
                포트 보안을 활성화하여 승인된 MAC 주소만 접속할 수 있도록 합니다.
              </li>
            </ol>
          </li>
          <li>
            VLAN 구성:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                중요한 시스템과 일반 업무용 시스템을 분리하기 위해 VLAN을 구성합니다.
              </li>
              <li>
                VLAN 간 통신은 필요한 경우에만 허용하는 접근 제어 목록(ACL)을 설정합니다.
              </li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">네트워크 세분화</h2>
        <p>
          네트워크 세분화는 침해 사고 발생 시 피해 범위를 제한하는 데 중요합니다:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>DMZ(Demilitarized Zone) 구성:</strong> 외부에 공개되는 서버(웹, 이메일 등)는 
            DMZ에 배치하여 내부 네트워크와 분리합니다.
          </li>
          <li>
            <strong>내부 네트워크 세분화:</strong> 부서, 기능, 보안 수준 등에 따라 내부 네트워크를 
            세분화합니다.
          </li>
          <li>
            <strong>관리 네트워크 분리:</strong> 네트워크 장비 관리 인터페이스는 별도의 관리 
            네트워크를 통해서만 접근 가능하도록 구성합니다.
          </li>
          <li>
            <strong>IoT 장치 격리:</strong> IoT 장치들은 별도의 네트워크에 배치하여 주요 
            시스템으로의 접근을 차단합니다.
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">네트워크 모니터링</h2>
        <p>
          네트워크 보안 상태를 지속적으로 모니터링하기 위한 설정:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            모니터링 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>라우터 및 스위치의 로그 수집을 활성화합니다.</li>
              <li>중앙 집중식 로그 서버를 구축하여 네트워크 장비의 로그를 수집합니다.</li>
              <li>비정상적인 트래픽 패턴 탐지를 위한 네트워크 모니터링 도구를 구현합니다.</li>
            </ol>
          </li>
          <li>
            침입 탐지/방지 시스템(IDS/IPS):
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>경계 네트워크에 IDS/IPS를 배치합니다.</li>
              <li>정기적으로 IDS/IPS 시그니처를 업데이트합니다.</li>
              <li>알림 임계값을 적절히 조정하여 오탐지와 누락 탐지의 균형을 맞춥니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">원격 접속 보안</h2>
        <p>
          원격 사용자의 네트워크 접속 보안을 강화하기 위한 설정:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>VPN 구현:</strong> 모든 원격 접속은 암호화된 VPN을 통해서만 
            가능하도록 설정합니다.
          </li>
          <li>
            <strong>다단계 인증(MFA):</strong> VPN 접속 시 MFA를 요구하여 보안을 
            강화합니다.
          </li>
          <li>
            <strong>접근 제어:</strong> 원격 사용자는 필요한 리소스에만 접근할 수 있도록 
            권한을 제한합니다.
          </li>
          <li>
            <strong>세션 타임아웃:</strong> 일정 시간 동안 활동이 없는 원격 세션은 
            자동으로 종료됩니다.
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">DNS 보안</h2>
        <p>
          DNS(Domain Name System) 보안 강화 방법:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            <strong>DNS over HTTPS(DoH) 또는 DNS over TLS(DoT):</strong> DNS 쿼리를 
            암호화하여 중간자 공격 위험을 줄입니다.
          </li>
          <li>
            <strong>DNSSEC 구현:</strong> DNS 응답의 무결성과 출처를 검증합니다.
          </li>
          <li>
            <strong>DNS 필터링:</strong> 악성 도메인 접속을 차단하는 DNS 필터링 솔루션을 
            구현합니다.
          </li>
          <li>
            <strong>내부 DNS 서버:</strong> 신뢰할 수 있는 내부 DNS 서버를 구성하고 
            정기적으로 업데이트합니다.
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">패치 및 업데이트</h2>
        <p>
          네트워크 장비의 보안을 유지하기 위한 패치 관리:
        </p>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            모든 네트워크 장비(라우터, 스위치, 무선 AP 등)의 펌웨어를 최신 버전으로 
            유지합니다.
          </li>
          <li>
            패치 적용 전 테스트 환경에서 검증하여 호환성 문제를 확인합니다.
          </li>
          <li>
            패치 적용 일정을 수립하고 정기적으로 업데이트 상태를 검토합니다.
          </li>
          <li>
            패치 적용 후 네트워크 장비의 동작을 모니터링하여 문제를 조기에 발견합니다.
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          네트워크 설정 관련 문의 사항이 있는 경우 아래 담당자에게 연락하세요:
        </p>
        <p>네트워크 관리팀: 내선 3456 또는 network-admin@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}