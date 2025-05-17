// app/middleware.js

import { NextResponse } from "next/server";
import { PROTECTED_ROUTES } from "@/app/utils/auth-constants";

export function middleware(request) {
  // 현재 경로 확인
  const path = request.nextUrl.pathname;

  // 보호된 경로인지 확인
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    path.startsWith(route)
  );

  // 로그인 페이지인지 확인
  const isLoginPage = path === "/login";

  // 쿠키에서 토큰 확인
  const authToken = request.cookies.get("auth_token")?.value;

  // 인증 필요한 페이지 & 토큰 없음 => 로그인으로 리디렉션
  if (isProtectedRoute && !authToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // 로그인 페이지 & 이미 토큰 있음 => 홈으로 리디렉션
  if (isLoginPage && authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};