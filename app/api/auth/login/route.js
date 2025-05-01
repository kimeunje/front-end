// app/api/auth/login/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  TOKEN_STORAGE_KEY,
  TOKEN_EXPIRATION,
} from "@/app/utils/auth-constants";

// 데모용 사용자 데이터 (실제로는 데이터베이스에서 관리해야 합니다)
const USERS = [
  {
    id: 1,
    username: "admin",
    password: "admin1234", // 실제로는 암호화된 비밀번호를 저장해야 합니다
    name: "관리자",
    role: "admin",
  },
  {
    id: 2,
    username: "user",
    password: "user1234",
    name: "일반 사용자",
    role: "user",
  },
];

export async function POST(request) {
  try {
    // 요청 바디에서 사용자 정보 추출
    const { username, password } = await request.json();

    // 사용자 확인
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 비밀번호는 제외하고 사용자 정보 준비
    const { password: _, ...userWithoutPassword } = user;

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    // 응답 생성
    const response = NextResponse.json({
      message: "로그인 성공",
      user: userWithoutPassword,
    });

    // 쿠키 설정 (미들웨어에서 사용)
    response.cookies.set({
      name: TOKEN_STORAGE_KEY,
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8, // 8시간 (초 단위)
      sameSite: "strict",
      // secure: process.env.NODE_ENV === "production", // 프로덕션에서는 HTTPS에서만 전송
    });

    return response;
  } catch (error) {
    console.error("로그인 처리 중 오류 발생:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}