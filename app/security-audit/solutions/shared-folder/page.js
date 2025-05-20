// app/security-audit/solutions/shared-folder/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function SharedFolderPolicyPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">공유폴더 보안 점검</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          공유폴더는 네트워크 상에서 중요한 보안 취약점이 될 수 있습니다. 불필요하거나 
          적절히 보호되지 않은 공유폴더는 내부 정보 유출의 경로가 될 수 있으므로 
          정기적인 점검과 관리가 필요합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">공유폴더 보안 정책 요구사항</h2>
        <p>다음 공유폴더 보안 정책이 반드시 적용되어 있어야 합니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>인가된 공유폴더만 사용:</strong> 업무상 필요한 폴더만 공유되어야 함
          </li>
          <li>
            <strong>최소 권한 원칙 적용:</strong> 공유 폴더에 대한 접근 권한은 필요한 최소 수준으로 제한
          </li>
          <li>
            <strong>익명 접근 금지:</strong> 모든 공유 폴더는 인증된 사용자만 접근 가능해야 함
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">공유폴더 점검 방법 (Windows)</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            현재 공유폴더 목록 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows + R 키를 눌러 실행 창을 엽니다.</li>
              <li>fsmgmt.msc를 입력하고 확인을 클릭합니다.</li>
              <li>공유 폴더 관리 콘솔에서 현재 공유된 모든 폴더를 확인할 수 있습니다.</li>
            </ol>
          </li>
          <li>
            불필요한 공유폴더 제거:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>공유 폴더 관리 콘솔에서 불필요한 공유 폴더를 선택합니다.</li>
              <li>마우스 오른쪽 버튼으로 클릭하고 "공유 중지"를 선택합니다.</li>
            </ol>
          </li>
          <li>
            공유폴더 권한 확인 및 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>점검할 공유 폴더를 선택합니다.</li>
              <li>마우스 오른쪽 버튼으로 클릭하고 "속성"을 선택합니다.</li>
              <li>"공유 권한" 탭을 클릭합니다.</li>
              <li>"Everyone" 그룹에 권한이 부여되어 있는지 확인합니다.</li>
              <li>필요한 경우 "Everyone" 그룹을 제거하고 특정 사용자 또는 그룹에만 권한을 부여합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">명령줄을 통한 공유폴더 확인</h2>
        <p>다음 명령을 사용하여 현재 시스템의 모든 공유폴더를 확인할 수 있습니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>net share</code>
        </div>
        
        <p>
          특정 공유폴더의 상세 정보를 확인하려면 다음 명령어를 사용합니다:
        </p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>net share 공유폴더명</code>
        </div>
        
        <p>PowerShell을 사용하여 더 자세한 공유폴더 정보를 확인할 수 있습니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>Get-SmbShare | Format-Table -Property Name, Path, Description, EncryptData -AutoSize</code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">공유폴더 보안 모범 사례</h2>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>기본 관리자 공유($ADMIN, $C 등)를 제외한 모든 불필요한 공유는 제거합니다.</li>
          <li>공유 폴더 이름은 내용을 유추하기 어렵게 지정합니다(예: "재무데이터" 대신 "FD2023" 등).</li>
          <li>가능한 경우 공유폴더의 데이터를 암호화합니다.</li>
          <li>공유폴더 접근 로그를 활성화하고 정기적으로 검토합니다.</li>
          <li>주기적으로(최소 분기별) 모든 공유폴더 목록을 검토하고 불필요한 공유를 제거합니다.</li>
          <li>사용자가 직접 폴더를 공유할 수 있는 기능은 가능한 제한합니다.</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">그룹 정책을 통한 공유폴더 제어 (관리자용)</h2>
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
            공유 설정 위치로 이동:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                컴퓨터 구성 → 관리 템플릿 → 네트워크 → 랜드만 서버로 이동합니다.
              </li>
            </ol>
          </li>
          <li>
            안전하지 않은 게스트 액세스 방지:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"익명 액세스를 제한하기 위해 추가 제한 사항 적용" 정책을 더블 클릭합니다.</li>
              <li>"사용" 옵션을 선택하고 확인을 클릭합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          공유폴더 보안 정책 설정이나 확인에 문제가 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안관리팀: 내선 1234 또는 security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}