// app/security-audit/contact/page.js

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";

export default function ContactPage() {
  const pathname = usePathname();
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    email: "",
    phone: "",
    category: "general",
    subject: "",
    message: "",
  });

  // 제출 상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState({
    success: false,
    message: "",
  });

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 여기서는 실제 API 호출 대신 제출 성공을 시뮬레이션합니다.
    // 실제 구현 시 API 엔드포인트로 데이터를 전송해야 합니다.
    try {
      // 실제 API 호출이 이루어져야 하는 부분
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // 성공 처리 (시뮬레이션)
      setTimeout(() => {
        setSubmitResult({
          success: true,
          message: "문의가 성공적으로 제출되었습니다. 담당자가 확인 후 연락드리겠습니다.",
        });
        setFormData({
          name: "",
          department: "",
          email: "",
          phone: "",
          category: "general",
          subject: "",
          message: "",
        });
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      // 에러 처리
      setSubmitResult({
        success: false,
        message: "문의 제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">문의하세요</h1>

      <div className="section">
        <h2 className="section-title">보안 감사 관련 문의</h2>
        <p>
          상시보안감사와 관련된 질문이나 도움이 필요하신 경우 아래 양식을 작성하여
          문의해 주세요. 담당자가 확인 후 빠르게 답변드리겠습니다.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">문의 양식</h2>

        {submitResult.message && (
          <div
            style={{
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "4px",
              backgroundColor: submitResult.success
                ? "#e8f5e9"
                : "#ffebee",
              color: submitResult.success ? "#2e7d32" : "#c62828",
              border: submitResult.success
                ? "1px solid #a5d6a7"
                : "1px solid #ef9a9a",
            }}
          >
            {submitResult.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {/* 이름 */}
            <div>
              <label
                htmlFor="name"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                }}
              >
                이름 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>

            {/* 부서 */}
            <div>
              <label
                htmlFor="department"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                }}
              >
                부서 *
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>

            {/* 이메일 */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                }}
              >
                이메일 *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label
                htmlFor="phone"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                }}
              >
                전화번호 (내선)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>

            {/* 문의 유형 */}
            <div>
              <label
                htmlFor="category"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                }}
              >
                문의 유형 *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  backgroundColor: "white",
                }}
              >
                <option value="general">일반 문의</option>
                <option value="technical">기술 지원</option>
                <option value="policy">정책 문의</option>
                <option value="report">보안 문제 신고</option>
                <option value="improvement">개선 제안</option>
              </select>
            </div>

            {/* 제목 */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label
                htmlFor="subject"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                }}
              >
                제목 *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>

            {/* 문의 내용 */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label
                htmlFor="message"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "500",
                }}
              >
                문의 내용 *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  resize: "vertical",
                }}
              ></textarea>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "12px 30px",
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "제출 중..." : "문의 제출"}
            </button>
          </div>
        </form>
      </div>

      <div className="section">
        <h2 className="section-title">담당자 직접 연락</h2>
        <p>
          긴급한 문의나 직접 상담이 필요한 경우 아래 연락처로 문의하세요:
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "15px",
          }}
        >
          {/* 보안감사팀 연락처 */}
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px 0",
                fontSize: "1.1rem",
                color: "#333",
              }}
            >
              보안감사팀
            </h3>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>담당자:</strong> 홍길동 팀장
            </p>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>전화:</strong> 내선 1234
            </p>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>이메일:</strong> security-audit@example.com
            </p>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>업무시간:</strong> 평일 09:00 - 18:00
            </p>
          </div>

          {/* IT 지원팀 연락처 */}
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px 0",
                fontSize: "1.1rem",
                color: "#333",
              }}
            >
              IT 지원팀
            </h3>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>담당자:</strong> 김철수 과장
            </p>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>전화:</strong> 내선 4567
            </p>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>이메일:</strong> it-support@example.com
            </p>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>업무시간:</strong> 평일 09:00 - 20:00
            </p>
          </div>

          {/* 네트워크 보안팀 연락처 */}
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px 0",
                fontSize: "1.1rem",
                color: "#333",
              }}
            >
              네트워크 보안팀
            </h3>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>담당자:</strong> 이영희 부장
            </p>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>전화:</strong> 내선 7890
            </p>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>이메일:</strong> network-security@example.com
            </p>
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>업무시간:</strong> 평일 09:00 - 18:00
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">자주 묻는 질문 (FAQ)</h2>
        <div style={{ marginTop: "15px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#333",
                margin: "0 0 10px 0",
              }}
            >
              Q: 보안 감사는 얼마나 자주 진행되나요?
            </h3>
            <p style={{ margin: "0", color: "#555" }}>
              A: 정기 보안 감사는 분기마다 진행되며, 상시보안감사는 시스템에서 자동으로
              매일 모니터링됩니다. 특별한 보안 이슈가 발생하면 추가적인 감사가 진행될 수 있습니다.
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#333",
                margin: "0 0 10px 0",
              }}
            >
              Q: 보안 감사에서 문제가 발견되면 어떻게 해야 하나요?
            </h3>
            <p style={{ margin: "0", color: "#555" }}>
              A: 문제가 발견되면 해당 페이지의 조치방법에 따라 조치하고, 문제가 지속되거나
              도움이 필요한 경우 보안감사팀에 문의하시기 바랍니다.
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#333",
                margin: "0 0 10px 0",
              }}
            >
              Q: 제출한 문의는 언제 답변받을 수 있나요?
            </h3>
            <p style={{ margin: "0", color: "#555" }}>
              A: 일반적으로 문의 제출 후 1-2 영업일 이내에 답변을 드립니다.
              긴급한 문의의 경우 전화로 직접 연락주시면 더 빠른 지원이 가능합니다.
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#333",
                margin: "0 0 10px 0",
              }}
            >
              Q: 보안 정책에 대한 예외 요청은 어떻게 하나요?
            </h3>
            <p style={{ margin: "0", color: "#555" }}>
              A: 보안 정책 예외 요청은 위 문의 양식에서 문의 유형을 "정책 문의"로 선택하고
              상세한 예외 필요 사유와 기간을 명시하여 제출해 주세요. 보안 위원회 검토 후 
              승인 여부를 알려드립니다.
            </p>
          </div>
        </div>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}