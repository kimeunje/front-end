'use client';

import { usePathname } from 'next/navigation';
import PageNavigation from '@/app/components/PageNavigation';

export default function EndpointSolutionPage() {
  const pathname = usePathname();
  
  return (
    <div>
      <h1 className="page-title">엔드포인트 솔루션 관리</h1>
      
      <div className="section">
        <h2 className="section-title">개요</h2>
        <p>엔드포인트 보안 솔루션의 올바른 설치 및 구성 방법을 안내합니다. 엔드포인트 보안은 PC, 노트북 등 사용자 장치의 보안을 강화하는 중요한 요소입니다.</p>
      </div>
      
      <div className="section">
        <h2 className="section-title">필수 설치 솔루션</h2>
        <p>다음 엔드포인트 보안 솔루션이 반드시 설치되어 있어야 합니다:</p>
        <ul style={{ marginLeft: '20px', marginTop: '10px', listStyleType: 'disc' }}>
          <li>백신 소프트웨어</li>
          <li>개인 방화벽</li>
          <li>DLP(데이터 유출 방지) 솔루션</li>
          <li>패치 관리 시스템</li>
        </ul>
      </div>
      
      <div className="section">
        <h2 className="section-title">설치 확인 방법</h2>
        <ol style={{ marginLeft: '20px', marginTop: '10px' }}>
          <li>Windows 시스템:
            <ol style={{ marginLeft: '20px', marginTop: '5px', listStyleType: 'lower-alpha' }}>
              <li>시작 메뉴 → 설정 → 앱 → 설치된 앱으로 이동합니다.</li>
              <li>필수 보안 솔루션이 설치되어 있는지 확인합니다.</li>
            </ol>
          </li>
          <li>서비스 확인:
            <ol style={{ marginLeft: '20px', marginTop: '5px', listStyleType: 'lower-alpha' }}>
              <li>Windows 검색에서 서비스를 검색하여 실행합니다.</li>
              <li>보안 솔루션 관련 서비스가 실행 중 상태인지 확인합니다.</li>
            </ol>
          </li>
          <li>작업 표시줄 트레이에서 보안 솔루션 아이콘이 활성화되어 있는지 확인합니다.</li>
        </ol>
      </div>
      
      <div className="section">
        <h2 className="section-title">솔루션 구성 요구사항</h2>
        <ul style={{ marginLeft: '20px', marginTop: '10px', listStyleType: 'disc' }}>
          <li>백신 소프트웨어:
            <ul style={{ marginLeft: '20px', marginTop: '5px', listStyleType: 'circle' }}>
              <li>실시간 검사 기능 활성화</li>
              <li>매일 정기 검사 스케줄 설정</li>
              <li>최신 바이러스 정의 파일 자동 업데이트 설정</li>
            </ul>
          </li>
          <li>방화벽:
            <ul style={{ marginLeft: '20px', marginTop: '5px', listStyleType: 'circle' }}>
              <li>기본 인바운드 연결 차단</li>
              <li>승인된 애플리케이션만 네트워크 연결 허용</li>
            </ul>
          </li>
          <li>DLP 솔루션:
            <ul style={{ marginLeft: '20px', marginTop: '5px', listStyleType: 'circle' }}>
              <li>USB 장치 제어 활성화</li>
              <li>민감 정보 모니터링 기능 활성화</li>
            </ul>
          </li>
        </ul>
      </div>
      
      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>엔드포인트 보안 솔루션 설치 또는 구성에 문제가 있는 경우 아래 담당자에게 문의하세요:</p>
        <p>보안 관리팀: 내선 1234 또는 security@example.com</p>
      </div>
      
      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}