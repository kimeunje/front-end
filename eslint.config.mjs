import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Next.js 기본 규칙 가져오기
const nextConfig = compat.extends("next/core-web-vitals");

// 사용자 정의 규칙 추가하기
const customRules = {
  files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
  rules: {
    "react/no-unescaped-entities": "off",
  },
};

// 최종 설정 구성
const eslintConfig = [...nextConfig, customRules];

export default eslintConfig;