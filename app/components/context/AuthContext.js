// app/components/context/AuthContext.js

"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const router = useRouter();

  // 최초 로드시 사용자 정보 가져오기
  useEffect(() => {
    async function loadUserInfo() {
      try {
        console.log("사용자 인증 상태 확인 중...");

        // 서버에서 사용자 정보 가져오기
        const response = await fetch(`http://10.106.25.129:5001/api/auth/me`, {
          credentials: "include", // 쿠키 포함
        });

        console.log("인증 응답 상태:", response.status);

        if (response.ok) {
          const userData = await response.json();

          if (userData.authenticated) {
            console.log("인증 성공:", userData);
            setUser(userData);
            setAuthError(null);
          } else {
            console.log("인증 실패: 토큰은 있지만 유효하지 않음");
            setUser(null);
            setAuthError("인증 세션이 만료되었습니다");
            // 쿠키가 있지만 유효하지 않은 경우, 쿠키 삭제
            await logout(false); // 리디렉션 없이 로그아웃
          }
        } else {
          console.log("인증 요청 실패:", response.status);
          // 401 또는 다른 오류 상태
          setUser(null);
          const errorData = await response.json().catch(() => ({}));
          setAuthError(errorData.message || "인증에 실패했습니다");

          if (response.status === 401) {
            // 토큰이 만료된 경우 쿠키 삭제
            document.cookie =
              "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }
        }
      } catch (error) {
        console.error("인증 상태 확인 중 오류 발생:", error);
        setUser(null);
        setAuthError("인증 확인 중 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    }

    loadUserInfo();
  }, []);

  // 로그인 함수
  const login = async (username, password) => {
    try {
      // 자격증명 확인
      const credentialResponse = await fetch(
        `http://10.106.25.129:5001/api/auth/check-credentials`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        }
      );

      if (!credentialResponse.ok) {
        const error = await credentialResponse.json();
        throw new Error(error.message || "로그인에 실패했습니다.");
      }

      const credentialData = await credentialResponse.json();
      return credentialData;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 이메일 인증 코드 요청
  const requestVerificationCode = async (email) => {
    try {
      const response = await fetch(
        `http://10.106.25.129:5001/api/auth/email-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
          credentials: "include",
        }
      );

      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 인증 코드 확인 및 최종 로그인
  const verifyAndLogin = async (email, code, username, password) => {
    try {
      const response = await fetch(
        `http://10.106.25.129:5001/api/auth/verify-and-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code, username, password }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "인증에 실패했습니다.");
      }

      // 사용자 정보 가져오기
      const userResponse = await fetch(
        `http://10.106.25.129:5001/api/auth/me`,
        {
          credentials: "include",
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.authenticated) {
          setUser(userData);
          setAuthError(null);
          return { success: true };
        } else {
          throw new Error("인증에 실패했습니다.");
        }
      } else {
        throw new Error("사용자 정보를 가져오는데 실패했습니다.");
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 로그아웃 함수 - 리디렉션 옵션 추가
  const logout = async (redirect = true) => {
    try {
      // 서버에 로그아웃 요청
      await fetch(`http://10.106.25.129:5001/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);

      // 리디렉션 옵션이 true인 경우만 로그인 페이지로 이동
      if (redirect) {
        router.push("/login");
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  // 인증 상태 확인 함수
  const isAuthenticated = () => {
    return !!user;
  };

  // 인증 상태 새로고침 함수
  const refreshAuthState = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://10.106.25.129:5001/api/auth/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.authenticated) {
          setUser(userData);
          setAuthError(null);
        } else {
          setUser(null);
          setAuthError("인증 세션이 만료되었습니다");
          await logout(false);
        }
      } else {
        setUser(null);
        setAuthError("인증에 실패했습니다");
      }
    } catch (error) {
      console.error("인증 상태 새로고침 중 오류:", error);
      setUser(null);
      setAuthError("인증 확인 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  // 값 객체
  const value = {
    user,
    loading,
    authError,
    login,
    logout,
    isAuthenticated,
    requestVerificationCode,
    verifyAndLogin,
    refreshAuthState,
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