// app/api/auth/logout/route.js

import { NextResponse } from "next/server";
import { TOKEN_STORAGE_KEY } from "@/app/utils/auth-constants";

export async function POST() {
  try {
    // 응답 생성
    const response = NextResponse.json({
      message: "로그아웃 성공",
    });

    // 쿠키 삭제
    response.cookies.set({
      name: TOKEN_STORAGE_KEY,
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0, // 즉시 만료
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("로그아웃 처리 중 오류 발생:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}