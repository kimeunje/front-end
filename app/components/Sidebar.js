'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU_STRUCTURE } from '../data/security-audit-config';

export default function Sidebar() {
  const pathname = usePathname();
  
  // 주어진 경로가 현재 활성화된 경로인지 확인하는 함수
  const isPathActive = (path) => {
    return pathname === path;
  };
  
  // 주어진 경로가 현재 경로의 부모인지 확인하는 함수 (하위 메뉴 표시에 사용)
  const isParentPath = (path) => {
    if (pathname === path) return true;
    
    // 현재 경로가 주어진 경로로 시작하는지 확인
    return pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">상시보안감사</div>
      <ul className="sidebar-menu">
        {MENU_STRUCTURE.map((mainItem) => (
          <li key={mainItem.id} className="sidebar-main-item">
            <Link 
              href={mainItem.path}
              className={isParentPath(mainItem.path) ? 'active' : ''}
            >
              {mainItem.title}
            </Link>
            
            {/* 하위 메뉴가 있고, 현재 항목이 활성화되어 있으면 하위 메뉴 표시 */}
            {mainItem.subItems.length > 0 && isParentPath(mainItem.path) && (
              <ul className="sidebar-submenu">
                {mainItem.subItems.map((subItem) => (
                  <li key={subItem.id}>
                    <Link 
                      href={subItem.path}
                      className={isPathActive(subItem.path) ? 'active' : ''}
                    >
                      {subItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
