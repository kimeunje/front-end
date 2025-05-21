/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 정적 HTML 파일로 내보내기
  distDir: 'out',    // 출력 디렉토리 지정
  trailingSlash: true, // URL 끝에 슬래시 추가 (서버 설정에 따라 조정)
  images: {
    unoptimized: true // 정적 내보내기를 위한 이미지 최적화 비활성화
  },
  // npm 개발자 모드시 api 설정
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
}

export default nextConfig;