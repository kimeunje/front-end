'use client';

import { useRouter } from 'next/navigation';
import { getPreviousMenuItem, getNextMenuItem } from '../data/security-audit-config';

/**
 * 페이지 내비게이션 컴포넌트
 * 
 * 현재 페이지의 path를 기반으로 이전/다음 페이지로 이동할 수 있는 버튼을 렌더링합니다.
 * 중앙 설정 파일에서 메뉴 구조를 가져와 동적으로 네비게이션을 생성합니다.
 */
export default function PageNavigation({ currentPath }) {
  const router = useRouter();
  
  // 이전/다음 메뉴 아이템 가져오기
  const prevItem = getPreviousMenuItem(currentPath);
  const nextItem = getNextMenuItem(currentPath);
  
  return (
    <div className="pagination">
      <button
        onClick={() => prevItem && router.push(prevItem.path)}
        disabled={!prevItem}
        className={!prevItem ? 'disabled' : ''}
      >
        {prevItem ? `이전: ${prevItem.title}` : '이전'}
      </button>
      
      <button
        onClick={() => nextItem && router.push(nextItem.path)}
        disabled={!nextItem}
        className={!nextItem ? 'disabled' : ''}
      >
        {nextItem ? `다음: ${nextItem.title}` : '다음'}
      </button>
    </div>
  );
}