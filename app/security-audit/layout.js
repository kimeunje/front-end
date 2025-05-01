// app/security-audit/layout.js

import Sidebar from "@/app/components/Sidebar";

export default function SecurityAuditLayout({ children }) {
  return (
    <div className="content-wrapper">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}