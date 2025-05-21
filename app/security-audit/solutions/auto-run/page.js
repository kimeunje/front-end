// app/security-audit/solutions/auto-run/page.js

"use client";

import { usePathname } from "next/navigation";
import "@/app/styles/dashboard.css";
import PageNavigation from "@/app/components/PageNavigation";
import AutoRunDownload from "@/app/components/AutoRunDownload";

export default function AutoRunPolicyPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">이동매체 자동실행 제한 확인</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          이동식 미디어(USB 드라이브, CD/DVD 등)의 자동실행 기능은 편리하지만 심각한 보안 
          위험을 초래할 수 있습니다. 악성코드는 자동실행 기능을 이용하여 이동식 미디어를 
          통해 시스템에 침투할 수 있으므로, 자동실행 기능을 제한하는 것이 중요합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">자동 설정 도구</h2>
        <p>
          아래 버튼을 클릭하여 이동매체 자동실행 제한 설정 도구를 다운로드하세요. 
          이 도구는 레지스트리 설정을 자동으로 변경하여 이동매체 자동실행을 안전하게 제한합니다.
        </p>
        <div className="setup-actions simple" style={{ marginTop: "15px" }}>
          <AutoRunDownload />
        </div>

      </div>

      <div className="section">
        <h2 className="section-title">이동매체 자동실행 제한 정책 요구사항</h2>
        <p>다음 이동매체 자동실행 제한 정책이 반드시 적용되어 있어야 합니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>자동실행 기능 비활성화:</strong> 모든 유형의 드라이브에 대해 자동실행 기능이 비활성화되어 있어야 함
          </li>
          <li>
            <strong>레지스트리 설정:</strong> NoDriveTypeAutoRun 값이 255 또는 95로 설정되어 있어야 함
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">이동매체 자동실행 설정 확인 방법 (Windows)</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            레지스트리 편집기 열기:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows + R 키를 눌러 실행 창을 엽니다.</li>
              <li>regedit를 입력하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            자동실행 설정 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>다음 경로로 이동합니다: HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer</li>
              <li>"NoDriveTypeAutoRun" 값이 있는지 확인합니다.</li>
              <li>값이 255(0xFF) 또는 95(0x5F)인지 확인합니다. 이 값들은 모든 유형의 드라이브에 대해 자동실행을 비활성화합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">명령줄을 통한 이동매체 자동실행 설정 확인</h2>
        <p>다음 명령을 사용하여 현재 자동실행 설정을 확인할 수 있습니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v NoDriveTypeAutoRun</code>
        </div>
        
        <p>
          결과값이 0x000000ff(255) 또는 0x0000005f(95)이면 자동실행이 적절히 제한된 것입니다.
        </p>
        
        <p>PowerShell을 사용하여 자동실행 설정 확인:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer' -Name "NoDriveTypeAutoRun"</code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">이동매체 자동실행 설정 변경 방법</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            레지스트리 편집기에서 설정 변경:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>레지스트리 편집기에서 HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer로 이동합니다.</li>
              <li>오른쪽 창에서 "NoDriveTypeAutoRun" 값이 없으면 마우스 오른쪽 버튼을 클릭하고 새로 만들기 → DWORD(32비트) 값을 선택합니다.</li>
              <li>이름을 "NoDriveTypeAutoRun"으로 지정합니다.</li>
              <li>값을 더블 클릭하고 값 데이터를 255 또는 95로 설정합니다.</li>
              <li>기수를 "16진수"로 선택하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            명령줄을 통한 설정 변경:
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
          <code>reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v NoDriveTypeAutoRun /t REG_DWORD /d 255 /f</code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">이동매체 자동실행 제한 값 설명</h2>
        <p>NoDriveTypeAutoRun 레지스트리 값은 어떤 유형의 드라이브에서 자동실행을 비활성화할지 제어합니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li><strong>255 (0xFF):</strong> 모든 드라이브 유형에 대해 자동실행 비활성화</li>
          <li><strong>95 (0x5F):</strong> 대부분의 드라이브 유형에 대해 자동실행 비활성화</li>
          <li><strong>91 (0x5B):</strong> 이동식 드라이브에 대해 자동실행 비활성화</li>
        </ul>
        <p>보안을 위해서는 255(0xFF) 값을 권장합니다.</p>
      </div>

      <div className="section">
        <h2 className="section-title">이동매체 자동실행 보안 모범 사례</h2>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>모든 컴퓨터에서 자동실행 기능을 완전히 비활성화(255 값 사용)</li>
          <li>그룹 정책을 통해 조직 전체에 자동실행 제한 정책 적용</li>
          <li>외부 출처의 이동식 미디어는 사용 전 항상 악성코드 검사 실시</li>
          <li>회사 USB 드라이브 사용 정책 수립 및 교육</li>
          <li>가능한 경우 USB 포트 접근 제한 또는 모니터링</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">그룹 정책을 통한 자동실행 제한 (관리자용)</h2>
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
            자동실행 정책 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>컴퓨터 구성 → 관리 템플릿 → Windows 구성 요소 → 자동 실행 정책으로 이동합니다.</li>
              <li>"모든 드라이브에 대해 자동 실행 끄기" 정책을 더블 클릭합니다.</li>
              <li>"사용" 옵션을 선택하고 확인을 클릭합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          자동실행 설정에 문제가 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안관리팀: 내선 1234 또는 security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}