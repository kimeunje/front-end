// app/security-audit/solutions/screen-saver/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function ScreenSaverPolicyPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">화면보호기 사용 확인</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          화면보호기는 컴퓨터를 일정 시간 사용하지 않을 때 자동으로 잠금 상태로 전환하여 
          무단 접근을 방지하는 중요한 보안 기능입니다. 적절히 구성된 화면보호기는 
          사용자가 자리를 비운 동안 정보 유출을 방지하는 데 중요한 역할을 합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">화면보호기 보안 정책 요구사항</h2>
        <p>다음 화면보호기 보안 정책이 반드시 적용되어 있어야 합니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>화면보호기 활성화:</strong> 화면보호기가 활성화되어 있어야 함
          </li>
          <li>
            <strong>대기 시간 설정:</strong> 10분(600초) 이내에 화면보호기가 작동하도록 설정
          </li>
          <li>
            <strong>재개 시 암호 요구:</strong> 화면보호기에서 복귀 시 암호 입력 필요
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">화면보호기 설정 확인 방법 (Windows)</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            화면보호기 설정 열기:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>바탕 화면에서 마우스 오른쪽 버튼을 클릭하고 "개인 설정"을 선택합니다.</li>
              <li>왼쪽 메뉴에서 "잠금 화면"을 클릭합니다.</li>
              <li>"화면 보호기 설정"을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            화면보호기 설정 확인:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>화면 보호기 드롭다운 메뉴에서 "없음" 이외의 옵션이 선택되어 있는지 확인합니다.</li>
              <li>"대기" 필드가 10분(600초) 이하로 설정되어 있는지 확인합니다.</li>
              <li>"다시 시작할 때 로그온 화면 표시" 체크박스가 선택되어 있는지 확인합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">명령줄을 통한 화면보호기 설정 확인</h2>
        <p>다음 명령을 사용하여 현재 화면보호기 설정을 확인할 수 있습니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>reg query "HKCU\\Control Panel\\Desktop" /v ScreenSaveActive</code>
        </div>
        
        <p>
          결과값이 1이면 화면보호기가 활성화된 것이고, 0이면 비활성화된 것입니다.
        </p>
        
        <p>화면보호기 대기 시간을 확인하려면:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>reg query "HKCU\\Control Panel\\Desktop" /v ScreenSaveTimeOut</code>
        </div>
        
        <p>암호 보호 설정을 확인하려면:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>reg query "HKCU\\Control Panel\\Desktop" /v ScreenSaverIsSecure</code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">화면보호기 설정 변경 방법</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            화면보호기 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>화면 보호기 설정 창에서 화면 보호기 드롭다운 메뉴를 클릭합니다.</li>
              <li>"없음" 이외의 옵션을 선택합니다 (예: "빈 화면").</li>
            </ol>
          </li>
          <li>
            대기 시간 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"대기" 필드에 10 이하의 숫자를 입력합니다 (이 값은 분 단위임).</li>
            </ol>
          </li>
          <li>
            암호 보호 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"다시 시작할 때 로그온 화면 표시" 체크박스를 선택합니다.</li>
              <li>"적용" 버튼을 클릭하여 설정을 저장합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">화면보호기 보안 모범 사례</h2>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>화면보호기 대기 시간을 5분으로 설정하여 보안 강화</li>
          <li>빈 화면 또는 간단한 화면보호기 사용(복잡한 화면보호기는 시스템 리소스를 소모)</li>
          <li>모든 회사 컴퓨터에 일관된 화면보호기 정책 적용</li>
          <li>화면보호기와 함께 Windows + L 단축키를 사용하여 자리를 비울 때 수동으로 컴퓨터 잠금 습관 기르기</li>
          <li>화면보호기 비활성화를 방지하는 그룹 정책 적용(관리자용)</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">그룹 정책을 통한 화면보호기 설정 (관리자용)</h2>
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
            화면보호기 정책 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>사용자 구성 → 관리 템플릿 → 제어판 → 개인 설정으로 이동합니다.</li>
              <li>"화면 보호기 시간 초과 강제 적용" 정책을 더블 클릭합니다.</li>
              <li>"사용" 옵션을 선택하고 "화면 보호기 시간 초과(초)"에 600(또는 더 짧은 시간)을 입력합니다.</li>
              <li>"화면 보호기 활성화" 정책을 더블 클릭하고 "사용"을 선택합니다.</li>
              <li>"화면 보호기로 보호" 정책을 더블 클릭하고 "사용"을 선택합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          화면보호기 설정에 문제가 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안관리팀: 내선 1234 또는 security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}