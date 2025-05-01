// app/layout.js

import "./globals.css";
import Header from "./components/Header";
import ClientLayout from "@/app/components/ClientLayout";
import { AuthProvider } from "./components/context/AuthContext";

export const metadata = {
  title: "NICE디앤비 - 상시보안감사",
  description: "나이스디앤비 상시보안감사 포털",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <Header />
          {/* <ClientLayout>{children}</ClientLayout> */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}