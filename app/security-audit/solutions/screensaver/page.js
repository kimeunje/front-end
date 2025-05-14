// app/security-audit/solutions/screensaver/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function ScreensaverPolicyPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">화면보호기 준수</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          화면보호기 설정은 사용자가 자리를 비웠을 때 무단 접근을 방지하기 위한 중요한 보안 조치입니다.
          이 페이지에서는 화면보호기의 올바른 설정 방법과 검증 방법을 안내합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">화면보호기 정책 요구사항</h2>
        <p>다음 화면보호기 정책이 반드시 적용되어 있어야 합니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>화면보호기 활성화:</strong> 모든 시스템에 화면보호기가 활성화되어 있어야 함
          </li>
          <li>
            <strong>대기 시간:</strong> 최대 10분 이내로 비활성화 시간 설정 필요
          </li>
          <li>
            <strong>재개 시 암호 요구:</strong> 화면보호기 해제 시 반드시 암호 입력이 필요함
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">화면보호기 설정 방법 (Windows)</h2>
        <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li>
            화면보호기 설정 화면 열기:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>바탕 화면에서 마우스 오른쪽 버튼을 클릭합니다.</li>
              <li>개인 설정을 클릭합니다.</li>
              <li>잠금 화면을 클릭합니다.</li>
              <li>화면 시간 초과 설정을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            화면보호기 선택:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"화면 보호기 설정" 버튼을 클릭합니다.</li>
              <li>드롭다운 메뉴에서 화면 보호기를 선택합니다.</li>
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
              <li>"대기" 필드에 10분 이하의 값을 입력합니다.</li>
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
              <li>"다시 시작할 때 로그온 화면 표시" 옵션을 체크합니다.</li>
              <li>"적용" 버튼을 클릭한 후 "확인"을 클릭합니다.</li>
            </ol>
          </li>
        </ol>
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
            화면보호기 정책 위치로 이동:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                사용자 구성 → 관리 템플릿 → 제어판 → 개인 설정으로 이동합니다.
              </li>
            </ol>
          </li>
          <li>
            화면보호기 활성화:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"화면 보호기 활성화" 정책을 더블 클릭합니다.</li>
              <li>"사용" 옵션을 선택하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            화면보호기 대기 시간 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"화면 보호기 시간 제한" 정책을 더블 클릭합니다.</li>
              <li>값을 600초(10분) 이하로 설정하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            화면보호기 암호 보호 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"화면 보호기에 암호 사용" 정책을 더블 클릭합니다.</li>
              <li>"사용" 옵션을 선택하고 확인을 클릭합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">화면보호기 설정 확인 방법</h2>
        <p>다음 단계를 통해 현재 화면보호기 설정을 확인할 수 있습니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>reg query "HKEY_CURRENT_USER\Control Panel\Desktop" /v ScreenSaveActive</code>
        </div>
        
        <p>
          위 명령어를 명령 프롬프트(cmd)에서 실행하면 화면보호기 활성화 여부를 확인할 수 있습니다.
        </p>
        
        <p>화면보호기 대기 시간을 확인하려면 다음 명령어를 사용합니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>reg query "HKEY_CURRENT_USER\Control Panel\Desktop" /v ScreenSaveTimeOut</code>
        </div>
        
        <p>암호 보호 설정을 확인하려면 다음 명령어를 사용합니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>reg query "HKEY_CURRENT_USER\Control Panel\Desktop" /v ScreenSaverIsSecure</code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">화면보호기 보안 중요성</h2>
        <p>
          화면보호기 보안 설정은 다음과 같은 이유로 중요합니다:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>사용자가 자리를 비웠을 때 무단 접근을 방지합니다.</li>
          <li>내부자에 의한 정보 유출 위험을 줄입니다.</li>
          <li>우발적인 데이터 변경이나 삭제를 방지합니다.</li>
          <li>컴플라이언스 및 보안 감사 요구사항을 충족합니다.</li>
          <li>보안 인식 문화를 강화하는 데 도움이 됩니다.</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          화면보호기 정책 설정이나 확인에 문제가 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안관리팀: 내선 1234 또는 security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}