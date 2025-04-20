'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="logo">
            <Link href="/">NICE디앤비</Link>
          </div>

          <ul className="nav-links">
            <li>
              <Link
                href="/"
                className={pathname === '/' ? 'active' : ''}
              >
                메인
              </Link>
            </li>
            <li>
              <Link
                href="/security-audit"
                className={pathname.includes('/security-audit') ? 'active' : ''}
              >
                상시보안감사
              </Link>
            </li>
            <li>
              <Link
                href="/usage"
                className={pathname.includes('/usage') ? 'active' : ''}
              >
                Usage
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className={pathname.includes('/blog') ? 'active' : ''}
              >
                Blog
              </Link>
            </li>
          </ul>

          <div className="search-box">
            <input type="text" placeholder="Search" />
          </div>
        </nav>
      </div>
    </header>
  );
}