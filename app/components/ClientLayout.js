// app/components/ClientLayout.js

"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navigation />}
      <main className={isLoginPage ? "login-page" : ""}>{children}</main>
    </>
  );
}