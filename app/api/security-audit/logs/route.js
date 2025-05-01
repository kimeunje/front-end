// app/api/security-audit/logs/route.js

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 백엔드 API에 요청 보내기
    const response = await fetch(
      "http://localhost:5000/api/security-audit/logs",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // 백엔드 인증이 필요한 경우 토큰 추가
        // credentials: 'include', // 쿠키를 포함해야 하는 경우
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching security audit logs:", error);
    return NextResponse.json(
      { error: "보안 감사 로그를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}