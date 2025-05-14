// app/security-audit/solutions/firewall/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function FirewallPolicyPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">방화벽 정책 점검</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          방화벽은 내부 네트워크를 외부 위협으로부터 보호하는 첫 번째 방어선입니다.
          적절한 방화벽 설정과 정기적인 점검은 네트워크 보안을 유지하는 데 필수적입니다.
          이 페이지에서는 방화벽 정책의 올바른 설정 방법과 점검 방법을 안내합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">방화벽 정책 요구사항</h2>
        <p>다음 방화벽 정책이 반드시 적용되어 있어야 합니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>방화벽 활성화:</strong> 모든 시스템에서 방화벽이 활성화되어 있어야 함
          </li>
          <li>
            <strong>기본 거부 정책:</strong> 명시적으로 허용되지 않은 트래픽은 모두 차단
          </li>
          <li>
            <strong>최소 권한 원칙:</strong> 업무상 필요한 포트와 서비스만 허용
          </li>
          <li>
            <strong>인바운드/아웃바운드 규칙:</strong> 양방향 트래픽에 대해 적절한 제한 적용
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">Windows 방화벽 점검 방법</h2>
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
              <li>Windows + R 키를 눌러 실행 창을 엽니다.</li>
              <li>control firewall.cpl을 입력하고 확인을 클릭합니다.</li>
              <li>Windows Defender 방화벽 창에서 좌측의 "Windows Defender 방화벽 설정 또는 해제"를 클릭합니다.</li>
              <li>도메인, 개인 및 공용 네트워크 프로필에서 방화벽이 "켬" 상태인지 확인합니다.</li>
            </ol>
          </li>
          <li>
            고급 방화벽 설정 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows + R 키를 눌러 실행 창을 엽니다.</li>
              <li>wf.msc를 입력하고 확인을 클릭합니다.</li>
              <li>Windows Defender 방화벽과 고급 보안 콘솔이 열립니다.</li>
              <li>좌측 창에서 "인바운드 규칙" 및 "아웃바운드 규칙"을 확인합니다.</li>
              <li>불필요하게 개방된 포트가 있는지 검토합니다.</li>
            </ol>
          </li>
          <li>
            기본 동작 설정 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>고급 보안 콘솔 좌측 창에서 "Windows Defender 방화벽과 고급 보안"을 클릭합니다.</li>
              <li>우측 창에서 "Windows Defender 방화벽 속성"을 클릭합니다.</li>
              <li>도메인, 개인, 공용 프로필 탭을 각각 확인합니다.</li>
              <li>인바운드 연결 및 아웃바운드 연결의 기본 동작이 적절하게 설정되어 있는지 확인합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">명령줄을 통한 방화벽 확인</h2>
        <p>다음 명령을 사용하여 방화벽 상태를 확인할 수 있습니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>netsh advfirewall show allprofiles</code>
        </div>
        
        <p>
          특정 프로필의 방화벽 설정을 확인하려면 다음 명령어를 사용합니다:
        </p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>netsh advfirewall show currentprofile</code>
        </div>
        
        <p>방화벽 규칙을 확인하려면 다음 명령어를 사용합니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>netsh advfirewall firewall show rule name=all</code>
        </div>
        
        <p>PowerShell을 사용하여 방화벽 상태 확인:</p>
        
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
      </div>

      <div className="section">
        <h2 className="section-title">그룹 정책을 통한 방화벽 설정 (관리자용)</h2>
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
            방화벽 정책 위치로 이동:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                컴퓨터 구성 → 관리 템플릿 → 네트워크 → 네트워크 연결 → Windows Defender 방화벽으로 이동합니다.
              </li>
            </ol>
          </li>
          <li>
            도메인 프로필 방화벽 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"도메인 프로필에 대해 Windows Defender 방화벽 보호 설정" 정책을 더블 클릭합니다.</li>
              <li>"사용" 옵션을 선택하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            개인 프로필 방화벽 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"개인 프로필에 대해 Windows Defender 방화벽 보호 설정" 정책을 더블 클릭합니다.</li>
              <li>"사용" 옵션을 선택하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            공용 프로필 방화벽 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"공용 프로필에 대해 Windows Defender 방화벽 보호 설정" 정책을 더블 클릭합니다.</li>
              <li>"사용" 옵션을 선택하고 확인을 클릭합니다.</li>
            </ol>
          </li>
        </ol>
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
          <li>모든 네트워크 프로필(도메인, 개인, 공용)에 대해 방화벽을 활성화합니다.</li>
          <li>기본적으로 인바운드 연결은 차단하고 아웃바운드 연결은 허용하는 설정을 권장합니다.</li>
          <li>필요한 서비스 및 응용 프로그램에 대해서만 인바운드 규칙을 허용합니다.</li>
          <li>가능한 경우 IP 주소 및 포트 범위를 제한하여 규칙을 구체화합니다.</li>
          <li>중요한 시스템의 경우 아웃바운드 연결도 필요한 서비스에만 제한합니다.</li>
          <li>방화벽 로그를 활성화하고 정기적으로 검토합니다.</li>
          <li>정기적으로(최소 분기별) 모든 방화벽 규칙을 검토하고 불필요한 규칙을 제거합니다.</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">방화벽 로깅 구성</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            고급 방화벽 콘솔에서 로깅 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>wf.msc를 실행하여 고급 방화벽 콘솔을 엽니다.</li>
              <li>좌측 창에서 "Windows Defender 방화벽과 고급 보안"을 클릭합니다.</li>
              <li>우측 창에서 "속성"을 클릭합니다.</li>
              <li>각 프로필 탭(도메인, 개인, 공용)에서 "로깅 사용자 지정"을 클릭합니다.</li>
              <li>"삭제된 패킷 기록" 및 "성공한 연결 기록" 옵션을 "예"로 설정합니다.</li>
              <li>로그 파일 경로와 크기를 확인하고 필요에 따라 조정합니다.</li>
            </ol>
          </li>
          <li>
            명령줄을 통한 로깅 구성:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>관리자 권한으로 명령 프롬프트를 실행합니다.</li>
              <li>다음 명령어를 실행하여 모든 프로필에 대한 로깅을 활성화합니다:</li>
              <li><code>netsh advfirewall set allprofiles logging droppedconnections enable</code></li>
              <li><code>netsh advfirewall set allprofiles logging allowedconnections enable</code></li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          방화벽 정책 설정이나 확인에 문제가 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안관리팀: 내선 1234 또는 security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}