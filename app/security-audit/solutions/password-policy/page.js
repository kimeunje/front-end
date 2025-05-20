// app/security-audit/solutions/password-policy/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function PasswordPolicyPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">패스워드 정책 확인</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          강력한 패스워드 정책은 무단 액세스로부터 시스템과 데이터를 보호하는 데 필수적입니다. 
          길이, 복잡성, 변경 주기, 재사용 제한과 같은 요소들은 패스워드 보안의 핵심 요소입니다.
          이 페이지에서는 조직의 패스워드 정책 요구사항과 이를 확인하고 설정하는 방법을 안내합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">패스워드 정책 요구사항</h2>
        <p>다음 패스워드 정책 요구사항이 반드시 충족되어야 합니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>패스워드 길이의 적정성:</strong> 최소 8자 이상의 패스워드 길이 설정
          </li>
          <li>
            <strong>패스워드 복잡도:</strong> 대문자, 소문자, 숫자, 특수문자를 포함하는 복잡성 요구사항 활성화
          </li>
          <li>
            <strong>패스워드 주기적 변경:</strong> 90일 이내의 패스워드 만료 기간 설정
          </li>
          <li>
            <strong>동일 패스워드 설정 제한:</strong> 최소 5회 이상의 패스워드 기록 유지로 이전 패스워드 재사용 방지
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">패스워드 정책 확인 방법 (Windows)</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            로컬 보안 정책 열기:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>Windows + R 키를 눌러 실행 창을 엽니다.</li>
              <li>secpol.msc를 입력하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            패스워드 정책 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>로컬 보안 정책 창에서 "계정 정책" → "암호 정책"으로 이동합니다.</li>
              <li>오른쪽 창에서 다음 정책들을 확인합니다:</li>
              <ul style={{ marginLeft: "20px", marginTop: "5px" }}>
                <li>"최소 암호 길이" - 8자 이상으로 설정되어 있어야 합니다.</li>
                <li>"암호는 복잡성을 만족해야 함" - "사용"으로 설정되어 있어야 합니다.</li>
                <li>"최대 암호 사용 기간" - 90일 이하로 설정되어 있어야 합니다.</li>
                <li>"암호 기록 유지" - 5 이상으로 설정되어 있어야 합니다.</li>
              </ul>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">명령줄을 통한 패스워드 정책 확인</h2>
        <p>다음 명령을 사용하여 현재 패스워드 정책 설정을 확인할 수 있습니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>net accounts</code>
        </div>
        
        <p>
          위 명령은 패스워드 길이, 패스워드 사용 기간, 기록 유지 등의 정보를 표시합니다.
        </p>
        
        <p>PowerShell을 사용하여 보다 자세한 패스워드 정책을 확인할 수 있습니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>
            secedit /export /cfg C:\\temp\\secpol.cfg<br />
            Get-Content C:\\temp\\secpol.cfg | Select-String "PasswordComplexity\|MinimumPasswordLength\|MaximumPasswordAge\|PasswordHistorySize"
          </code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">패스워드 정책 설정 변경 방법</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            최소 암호 길이 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>로컬 보안 정책 창에서 "계정 정책" → "암호 정책"으로 이동합니다.</li>
              <li>"최소 암호 길이"를 더블 클릭합니다.</li>
              <li>값을 8 이상으로 설정하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            암호 복잡성 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"암호는 복잡성을 만족해야 함"을 더블 클릭합니다.</li>
              <li>"사용"을 선택하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            최대 암호 사용 기간 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"최대 암호 사용 기간"을 더블 클릭합니다.</li>
              <li>값을 90 이하로 설정하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            암호 기록 유지 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"암호 기록 유지"를 더블 클릭합니다.</li>
              <li>값을 5 이상으로 설정하고 확인을 클릭합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">패스워드 복잡성 요구사항 이해</h2>
        <p>"암호는 복잡성을 만족해야 함" 정책이 활성화되면 다음 요구사항이 적용됩니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>사용자 계정 이름이나 전체 이름의 일부를 포함하지 않아야 함</li>
          <li>최소 6자 이상이어야 함 (최소 암호 길이 정책이 더 긴 경우 해당 값이 적용됨)</li>
          <li>다음 4가지 범주 중 3가지 이상을 포함해야 함:
            <ul style={{ marginLeft: "20px", marginTop: "5px" }}>
              <li>영문 대문자 (A-Z)</li>
              <li>영문 소문자 (a-z)</li>
              <li>숫자 (0-9)</li>
              <li>특수 문자 (!@#$% 등)</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">패스워드 보안 모범 사례</h2>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>12자 이상의 긴 패스워드 사용 권장</li>
          <li>단어의 단순한 조합이나 일반적인 문구 사용 피하기</li>
          <li>같은 패스워드를 여러 시스템이나 서비스에 재사용하지 않기</li>
          <li>패스워드 관리자 사용으로 복잡한 고유 패스워드 생성 및 저장</li>
          <li>가능한 경우 2단계 인증 또는 다중 인증 활성화</li>
          <li>패스워드를 주기적으로 변경하되, 너무 자주 변경하면 보안이 약한 패스워드 사용 유발 가능</li>
          <li>패스워드를 기록하거나 공유하지 않기</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">그룹 정책을 통한 패스워드 관리 (관리자용)</h2>
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
            패스워드 정책 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>컴퓨터 구성 → Windows 설정 → 보안 설정 → 계정 정책 → 암호 정책으로 이동합니다.</li>
              <li>필요한 정책을 설정합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          패스워드 정책 설정에 문제가 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안관리팀: 내선 1234 또는 security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}