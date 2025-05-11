// app/security-audit/solutions/password/page.js

"use client";

import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function PasswordPolicyPage() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="page-title">패스워드 정책 관리</h1>

      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>
          안전한 패스워드 정책 설정은 시스템 보안의 핵심 요소입니다. 이 페이지에서는
          패스워드 정책의 올바른 설정 방법과 검증 방법을 안내합니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">패스워드 정책 요구사항</h2>
        <p>다음 패스워드 정책이 반드시 적용되어 있어야 합니다:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>
            <strong>암호 복잡성 요구 사항:</strong> 암호에 대문자, 소문자, 숫자, 특수문자 중 
            3종류 이상을 포함해야 함
          </li>
          <li>
            <strong>최대 암호 사용 기간:</strong> 암호는 최대 90일 이내로 변경되어야 함
          </li>
          <li>
            <strong>암호 기록 크기:</strong> 최근 사용한 5개의 암호는 재사용할 수 없음
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">패스워드 정책 설정 방법 (Windows)</h2>
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
            암호 정책 위치로 이동:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>
                컴퓨터 구성 → Windows 설정 → 보안 설정 → 계정 정책 → 암호 정책으로
                이동합니다.
              </li>
            </ol>
          </li>
          <li>
            암호 복잡성 요구 사항 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"암호는 복잡성을 만족해야 함" 정책을 더블 클릭합니다.</li>
              <li>"사용" 옵션을 선택하고 확인을 클릭합니다.</li>
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
              <li>"최대 암호 사용 기간" 정책을 더블 클릭합니다.</li>
              <li>값을 90일로 설정하고 확인을 클릭합니다.</li>
            </ol>
          </li>
          <li>
            암호 기록 크기 설정:
            <ol
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "lower-alpha",
              }}
            >
              <li>"암호 기록 크기" 정책을 더블 클릭합니다.</li>
              <li>값을 5 이상으로 설정하고 확인을 클릭합니다.</li>
            </ol>
          </li>
        </ol>
      </div>

      <div className="section">
        <h2 className="section-title">패스워드 정책 확인 방법</h2>
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
          위 명령어를 명령 프롬프트(cmd)에서 실행하면 다음과 같은 정보를 확인할 수 있습니다:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>암호 최대 사용 기간</li>
          <li>암호 최소 사용 기간</li>
          <li>암호 최소 길이</li>
          <li>암호 기록 유지 개수</li>
        </ul>
        
        <p>도메인 환경에서는 다음 명령어를 사용합니다:</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginTop: '10px',
          marginBottom: '10px'
        }}>
          <code>net accounts /domain</code>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">암호 복잡성 요구사항 세부 사항</h2>
        <p>
          "암호는 복잡성을 만족해야 함" 정책이 사용으로 설정되면 암호는 다음 조건을 
          충족해야 합니다:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>암호는 사용자 계정 이름이나 전체 이름의 일부분을 포함할 수 없습니다.</li>
          <li>암호는 최소 6자 이상이어야 합니다.</li>
          <li>
            암호는 다음 네 가지 범주 중 세 가지 문자를 포함해야 합니다:
            <ul
              style={{
                marginLeft: "20px",
                marginTop: "5px",
                listStyleType: "circle",
              }}
            >
              <li>대문자(A-Z)</li>
              <li>소문자(a-z)</li>
              <li>숫자(0-9)</li>
              <li>특수 문자(!, @, #, $, % 등)</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">좋은 패스워드 생성 가이드라인</h2>
        <p>사용자들에게 다음과 같은 가이드라인을 제공하세요:</p>
        <ul
          style={{
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
          }}
        >
          <li>길고 기억하기 쉬운 문구를 사용합니다(예: "Blue-Sky-7-Cloud-Horse")</li>
          <li>의미 있는 단어들 사이에 특수 문자와 숫자를 혼합합니다.</li>
          <li>서로 다른 시스템에 동일한 암호를 재사용하지 않습니다.</li>
          <li>개인 정보(생일, 이름, 주소 등)가 포함된 암호는 피합니다.</li>
          <li>패스워드 관리 도구를 사용하여 복잡한 암호를 안전하게 저장합니다.</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          패스워드 정책 설정이나 확인에 문제가 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안관리팀: 내선 1234 또는 security@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}