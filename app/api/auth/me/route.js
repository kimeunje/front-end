// app/api/auth/me/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET, TOKEN_STORAGE_KEY } from "@/app/utils/auth-constants";

// 데모용 사용자 데이터 (실제로는 데이터베이스에서 관리해야 합니다)
const USERS = [
  {
    id: 1,
    username: "admin",
    password: "admin1234",
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

export async function GET(request) {
  try {
    // 쿠키에서 토큰 확인
    const token = request.cookies.get(TOKEN_STORAGE_KEY)?.value;

    if (!token) {
      return NextResponse.json(
        { message: "인증 토큰이 필요합니다." },
        { status: 401 }
      );
    }

    // 토큰 검증
    const decoded = jwt.verify(token, JWT_SECRET);

    // 사용자 ID로 사용자 정보 조회
    const user = USERS.find((u) => u.id === decoded.id);

    if (!user) {
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 비밀번호는 제외하고 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    // 토큰 검증 실패 또는 기타 오류
    console.error("사용자 정보 조회 중 오류 발생:", error);

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { message: "유효하지 않은 토큰입니다." },
        { status: 401 }
      );
    }

    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { message: "토큰이 만료되었습니다." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}