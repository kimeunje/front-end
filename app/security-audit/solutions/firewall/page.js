// app/security-audit/solutions/firewall/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function FirewallPolicyPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">방화벽 활성화 확인</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          Windows 방화벽은 네트워크 트래픽을 모니터링하고 보안 정책에 따라 특정 트래픽을 
          차단하여 컴퓨터를 보호하는 중요한 보안 도구입니다. 방화벽이 모든 네트워크 프로필에 
          대해 활성화되어 있어야 무단 네트워크 접근으로부터 시스템을 효과적으로 보호할 수 있습니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">방화벽 활성화 요구사항</h2>
        <p>다음 방화벽 활성화 요구사항이 반드시 충족되어야 합니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>도메인 프로필 활성화:</strong> 회사 네트워크(도메인)에 연결되었을 때 방화벽이 활성화되어야 함
          </li>
          <li>
            <strong>개인 프로필 활성화:</strong> 가정 또는 개인 네트워크에 연결되었을 때 방화벽이 활성화되어야 함
          </li>
          <li>
            <strong>공용 프로필 활성화:</strong> 공공 장소의 네트워크(카페, 공항 등)에 연결되었을 때 방화벽이 활성화되어야 함
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">방화벽 상태 확인 방법 (Windows)</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            Windows 방화벽 제어판 열기:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows + R 키를 눌러 실행 창을 엽니다.</li>
              <li>control firewall.cpl을 입력하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            방화벽 상태 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>왼쪽 창에서 "Windows Defender 방화벽 설정 또는 해제"를 클릭합니다.</li>
              <li>세 가지 네트워크 유형(도메인 네트워크 설정, 개인 네트워크 설정, 공용 네트워크 설정)에 대해 "Windows Defender 방화벽 켜기"가 선택되어 있는지 확인합니다.</li>
              <li>모든 프로필에 대해 "Windows Defender 방화벽 사용"이 선택되어 있어야 합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">명령줄을 통한 방화벽 상태 확인</h2>
        <p>PowerShell을 사용하여 모든 방화벽 프로필의 상태를 확인할 수 있습니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>Get-NetFirewallProfile | Format-Table Name, Enabled</code>
        </div>
        
        <p>
          결과에서 모든 프로필(Domain, Private, Public)의 Enabled 속성이 True로 표시되어야 합니다.
        </p>
        
        <p>특정 프로필의 방화벽 상태만 확인하려면:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>Get-NetFirewallProfile -Name Domain | Format-Table Name, Enabled</code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">방화벽 활성화 방법</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            제어판을 통한 방화벽 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows 방화벽 제어판을 엽니다.</li>
              <li>"Windows Defender 방화벽 설정 또는 해제"를 클릭합니다.</li>
              <li>모든 네트워크 유형에 대해 "Windows Defender 방화벽 켜기"를 선택합니다.</li>
              <li>"확인"을 클릭하여 변경사항을 저장합니다.</li>
            </ol>
          </li>
          <li>
            PowerShell을 통한 방화벽 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>관리자 권한으로 PowerShell을 실행합니다.</li>
              <li>다음 명령을 입력하여 모든 프로필에 대해 방화벽을 활성화합니다:</li>
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
          <code>Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True</code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">방화벽 보안 모범 사례</h2>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>모든 네트워크 유형(도메인, 개인, 공용)에 대해 방화벽을 항상 활성화</li>
          <li>불필요한 인바운드 규칙을 비활성화하거나 제거</li>
          <li>기본적으로 모든 인바운드 트래픽 차단 및 필요한 트래픽만 허용</li>
          <li>공용 네트워크에 연결할 때는 특히 더 엄격한 방화벽 설정 적용</li>
          <li>방화벽 로깅을 활성화하고 정기적으로 로그 검토</li>
          <li>애플리케이션이 방화벽 설정을 변경하려고 할 때 항상 신중하게 허용 여부 결정</li>
          <li>Windows 방화벽과 별도로 네트워크 수준의 방화벽 보안 유지</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">그룹 정책을 통한 방화벽 관리 (관리자용)</h2>
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
            방화벽 정책 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>컴퓨터 구성 → 관리 템플릿 → 네트워크 → 네트워크 연결 → Windows Defender 방화벽으로 이동합니다.</li>
              <li>"도메인 프로필용 Windows Defender 방화벽 보호 설정", "개인 프로필용 Windows Defender 방화벽 보호 설정", "공용 프로필용 Windows Defender 방화벽 보호 설정" 정책을 각각 구성합니다.</li>
              <li>각 정책에서 "사용"을 선택하고 "Windows Defender 방화벽 설정"을 "켬(연결 보안에 따라 인바운드 예외 허용)"으로 설정합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          방화벽 설정에 문제가 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안관리팀: 내선 1234 또는 security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}