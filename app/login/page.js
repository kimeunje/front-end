// app/login/page.js

"use client";

import "@/app/styles/login.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/components/context/AuthContext";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // 로그인 단계 상태 추가: "credentials" → "verification" → "complete"
  const [loginStep, setLoginStep] = useState("credentials");

  const router = useRouter();
  const { login, requestVerificationCode, verifyAndLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 자격증명 확인 및 이메일 인증 코드 요청
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // 먼저 자격증명(아이디/비밀번호)을 검증합니다
      const credentialData = await login(
        credentials.username,
        credentials.password
      );

      if (!credentialData.success) {
        throw new Error(
          credentialData.message || "아이디 또는 비밀번호가 올바르지 않습니다."
        );
      }

      // 이메일 주소 가져오기
      setVerificationEmail(
        credentialData.email || `${credentials.username}@example.com`
      );

      // 이메일 인증 코드 요청
      const verificationData = await requestVerificationCode(
        credentialData.email || `${credentials.username}@example.com`
      );

      if (!verificationData.success) {
        throw new Error(
          verificationData.message || "인증 코드 발송에 실패했습니다."
        );
      }

      // 인증 단계로 전환
      setMessage("이메일로 인증 코드가 발송되었습니다. 메일함을 확인해주세요.");
      setLoginStep("verification");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 이메일 인증 코드 확인 및 최종 로그인
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // 인증 코드 확인 및 로그인 요청
      const result = await verifyAndLogin(
        verificationEmail,
        verificationCode,
        credentials.username,
        credentials.password
      );

      if (!result.success) {
        throw new Error(result.error || "인증에 실패했습니다.");
      }

      setLoginStep("complete");

      // 리디렉션 쿼리 파라미터가 있으면 해당 경로로, 없으면 홈으로 이동
      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get("redirect") || "/";
      router.push(redirectPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 이메일 재발송 처리
  const handleResendCode = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await requestVerificationCode(verificationEmail);

      if (response.success) {
        setMessage("인증 코드가 이메일로 재발송되었습니다.");
      } else {
        throw new Error(response.message || "인증 코드 재발송에 실패했습니다.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 처음으로 돌아가기
  const handleBackToCredentials = () => {
    setLoginStep("credentials");
    setError("");
    setMessage("");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>상시보안감사</h1>
          {loginStep === "credentials" && <p>계정에 로그인하세요</p>}
          {loginStep === "verification" && <p>이메일 인증</p>}
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {loginStep === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">사용자 ID</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                placeholder="사용자 ID를 입력하세요"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "처리 중..." : "다음"}
            </button>
          </form>
        )}

        {loginStep === "verification" && (
          <form onSubmit={handleVerificationSubmit} className="login-form">
            <div className="verification-info">
              <p>
                <strong>{verificationEmail}</strong>으로 전송된 인증 코드를
                입력해주세요.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="verification-code">인증 코드</label>
              <input
                type="text"
                id="verification-code"
                name="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                placeholder="인증 코드 6자리를 입력하세요"
                maxLength="6"
                pattern="[0-9]{6}"
              />
            </div>

            <div className="verification-options">
              <button
                type="button"
                className="text-button"
                onClick={handleBackToCredentials}
              >
                이전으로 돌아가기
              </button>
              <button
                type="button"
                className="text-button"
                onClick={handleResendCode}
                disabled={loading}
              >
                인증 코드 재발송
              </button>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "인증 중..." : "인증 및 로그인"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}