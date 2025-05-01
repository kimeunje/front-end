// app/utils/auth-constants.js

// 로컬 스토리지 키
export const TOKEN_STORAGE_KEY = "nd_sec_tk_7x9z2";

// JWT 시크릿 키 (실제로는 환경 변수로 관리해야 합니다)
export const JWT_SECRET =
  process.env.JWT_SECRET || "your-secure-secret-key-8x72m1q9p3";

// 토큰 만료 시간
export const TOKEN_EXPIRATION = "8h";

// 보호된 경로 목록
export const PROTECTED_ROUTES = [
  "/security-audit",
  "/website-allow",
  "/mail",
  "/usb-request",
];