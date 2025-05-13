// app/api/security-audit/stats/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET, TOKEN_STORAGE_KEY } from "@/app/utils/auth-constants";

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
    const userId = decoded.id;

    // 백엔드 API에 요청 보내기 (사용자 ID 포함)
    const response = await fetch(
      `http://localhost:5000/api/security-audit/stats?user_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching security stats:", error);

    // 토큰 관련 에러 처리
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { error: "유효하지 않은 토큰입니다." },
        { status: 401 }
      );
    }

    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "토큰이 만료되었습니다." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "보안 통계 데이터를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}