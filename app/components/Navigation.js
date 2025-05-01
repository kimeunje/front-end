// app/components/Navigation.js

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navigation() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "상시보안감사", path: "/security-audit" },
    { name: "웹사이트 허용 신청", path: "/website-allow" },
    { name: "대용량 메일 작성", path: "/mail" },
    { name: "USB 반출 신청", path: "/usb-request" },
  ];

  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 스크롤 이벤트 처리
  const controlNavbar = () => {
    const currentScrollY = window.scrollY;

    // 페이지 상단에 있을 때는 항상 네비게이션 표시
    if (currentScrollY <= 10) {
      setIsHidden(false);
    }
    // 스크롤 방향 감지 (아래로 스크롤하면 숨김, 위로 스크롤하면 표시)
    else if (currentScrollY > lastScrollY + 10) {
      // 10px 이상 스크롤해야 반응
      setIsHidden(true);
    } else if (currentScrollY < lastScrollY - 10) {
      setIsHidden(false);
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    // 처음 로드 시 스크롤 위치 저장
    setLastScrollY(window.scrollY);

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", controlNavbar);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]); // lastScrollY가 변경될 때마다 useEffect 실행

  return (
    <nav className={`navigation ${isHidden ? "hidden" : ""}`}>
      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link href={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}