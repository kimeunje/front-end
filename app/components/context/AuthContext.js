// app/components/context/AuthContext.js

"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TOKEN_STORAGE_KEY,
  JWT_SECRET,
  TOKEN_EXPIRATION,
} from "@/app/utils/auth-constants";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 최초 로드시 사용자 정보 가져오기
  useEffect(() => {
    async function loadUserInfo() {
      try {
        // 서버에서 사용자 정보 가져오기 (쿠키는 자동으로 전송됨)
        const response = await fetch("/api/auth/me");

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("인증 상태 확인 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserInfo();
  }, []);

  // 로그인 함수
  const login = async (username, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "로그인에 실패했습니다.");
      }

      const data = await response.json();

      // 사용자 정보 설정 (토큰은 서버에서 쿠키로 설정됨)
      setUser(data.user);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      // 서버에 로그아웃 요청
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  // 인증 상태 확인 함수
  const isAuthenticated = () => {
    return !!user;
  };

  // 값 객체
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 인증 컨텍스트 사용을 위한 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth는 AuthProvider 내에서 사용되어야 합니다.");
  }
  return context;
};