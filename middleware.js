import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  JWT_SECRET,
  PROTECTED_ROUTES,
  TOKEN_STORAGE_KEY,
} from "@/app/utils/auth-constants";

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // 보호된 경로가 아니면 미들웨어를 건너뜁니다
  if (!PROTECTED_ROUTES.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // 쿠키에서 토큰 가져오기
  const token = request.cookies.get(TOKEN_STORAGE_KEY)?.value;

  console.log("토큰", token);
  // 로그인 페이지 URL 생성
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", path);

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 토큰 검증
    const textEncoder = new TextEncoder();
    const secretKey = textEncoder.encode(JWT_SECRET);
    await jwtVerify(token, secretKey);

    // 토큰이 유효하면 다음 처리로 이동
    return NextResponse.next();
  } catch (error) {
    // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
    console.error("미들웨어 토큰 검증 실패:", error);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/security-audit/:path*",
    "/website-allow/:path*",
    "/mail/:path*",
    "/usb-request/:path*",
  ],
};