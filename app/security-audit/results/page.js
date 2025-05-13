// app/security-audit/results/page.js

"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import PageNavigation from "@/app/components/PageNavigation";
import { useAuth } from "@/app/components/context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function SecurityAuditStatsDashboard() {
  const pathname = usePathname();
  const { user } = useAuth();

  // 통계 데이터 상태
  const [stats, setStats] = useState({
    totalChecks: 0,
    passedChecks: 0,
    failedChecks: 0,
    lastCheckedAt: "",
    score: 0,
  });

  // 보안 점검 항목 데이터
  const [checklistItems, setChecklistItems] = useState([]);

  // 로그 데이터
  const [auditLogs, setAuditLogs] = useState([]);

  // 선택된 항목 ID (상세 정보 표시용)
  const [selectedItemId, setSelectedItemId] = useState(null);

  // 시간별로 그룹화된 로그 (최근 7일)
  const [dailyStats, setDailyStats] = useState([]);

  // 항목별 통과/실패 통계
  const [itemStats, setItemStats] = useState([]);

  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 에러 상태
  const [error, setError] = useState(null);

  // API 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 병렬로 API 요청 보내기
        const [logsResponse, checklistResponse] = await Promise.all([
          fetch("/api/security-audit/logs"),
          fetch("/api/security-audit/checklist-items"),
        ]);

        // 응답 확인
        if (!logsResponse.ok) {
          throw new Error(`Logs API error: ${logsResponse.status}`);
        }

        if (!checklistResponse.ok) {
          throw new Error(`Checklist API error: ${checklistResponse.status}`);
        }

        // 데이터 파싱
        const logsData = await logsResponse.json();
        const checklistData = await checklistResponse.json();

        console.log("로그 데이터:", logsData);
        console.log("체크리스트 데이터:", checklistData);

        // 체크리스트 데이터 변환 (API 응답 형식에 맞게 조정)
        const formattedChecklistItems = checklistData.map((item) => ({
          id: item.item_id,
          name: item.name, // API 응답에 따라 name 또는 item_name일 수 있음
          category: item.category,
          description: item.description,
        }));

        // 상태 업데이트
        setAuditLogs(logsData);
        setChecklistItems(formattedChecklistItems);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(
          "데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
      } finally {
        setLoading(false);
      }
    };

    // 사용자가 로그인한 경우에만 데이터 로드
    if (user) {
      fetchData();
    }
  }, [user]);

  // 데이터가 로드되면 통계 계산
  useEffect(() => {
    if (auditLogs.length > 0 && checklistItems.length > 0) {
      // 통계 계산
      const totalChecks = auditLogs.length;
      const passedChecks = auditLogs.filter((log) => log.passed === 1).length;
      const failedChecks = auditLogs.filter((log) => log.passed === 0).length;

      // 가장 최근 검사 날짜
      const sortedLogs = [...auditLogs].sort(
        (a, b) => new Date(b.checked_at) - new Date(a.checked_at)
      );
      const lastCheckedAt =
        sortedLogs.length > 0 ? sortedLogs[0].checked_at : "";

      // 점수 계산 (통과율 * 100)
      const score =
        totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

      setStats({
        totalChecks,
        passedChecks,
        failedChecks,
        lastCheckedAt,
        score,
      });

      // 일별 통계 준비
      prepareDailyStats();

      // 항목별 통계 준비
      prepareItemStats();
    }
  }, [auditLogs, checklistItems]);

  // 일별 통계 준비 함수
  const prepareDailyStats = () => {
    // 날짜별로 로그를 그룹화
    const groupedByDate = {};

    auditLogs.forEach((log) => {
      const dateOnly = log.checked_at.split(" ")[0];
      if (!groupedByDate[dateOnly]) {
        groupedByDate[dateOnly] = { date: dateOnly, passed: 0, failed: 0 };
      }

      if (log.passed === 1) {
        groupedByDate[dateOnly].passed += 1;
      } else if (log.passed === 0) {
        groupedByDate[dateOnly].failed += 1;
      }
    });

    // 날짜순으로 정렬
    const sortedDates = Object.values(groupedByDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Recharts에서 사용하기 쉽게 데이터 구조 조정
    const chartData = sortedDates.map((day) => {
      const total = day.passed + day.failed;
      const passRate = total > 0 ? Math.round((day.passed / total) * 100) : 0;

      return {
        ...day,
        passRate,
        total,
      };
    });

    setDailyStats(chartData);
  };

  // 항목별 통계 준비 함수
  const prepareItemStats = () => {
    const itemStatsData = checklistItems.map((item) => {
      const itemLogs = auditLogs.filter((log) => log.item_id === item.id);
      const passedCount = itemLogs.filter((log) => log.passed === 1).length;
      const failedCount = itemLogs.filter((log) => log.passed === 0).length;
      const totalCount = passedCount + failedCount;
      const passRate = totalCount > 0 ? (passedCount / totalCount) * 100 : 0;

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        total: totalCount,
        passed: passedCount,
        failed: failedCount,
        passRate: Math.round(passRate),
      };
    });

    setItemStats(itemStatsData);
  };

  // 항목 상세 로그 조회
  const getItemLogs = (itemId) => {
    return auditLogs
      .filter((log) => log.item_id === itemId)
      .sort((a, b) => new Date(b.checked_at) - new Date(a.checked_at));
  };

  // 날짜 포맷 함수
  const formatDate = (dateStr) => {
    if (!dateStr) return "데이터 없음";

    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 선택된 항목의 로그
  const selectedItemLogs = selectedItemId ? getItemLogs(selectedItemId) : [];

  // 선택된 항목 정보
  const selectedItem = checklistItems.find(
    (item) => item.id === selectedItemId
  );

  // 로딩 중이거나 에러 발생 시 표시할 컴포넌트
  if (loading) {
    return (
      <div
        className="loading-container"
        style={{ padding: "20px", textAlign: "center" }}
      >
        <h1 className="page-title">보안 감사 결과</h1>
        <p>데이터를 로딩 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{ padding: "20px" }}>
        <h1 className="page-title">보안 감사 결과</h1>
        <div
          style={{
            padding: "20px",
            color: "#f44336",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
          }}
        >
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 16px",
              marginTop: "10px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="not-logged-info"
        style={{ padding: "20px", textAlign: "center" }}
      >
        <h1 className="page-title">보안 감사 결과</h1>
        <p>이 페이지에 접근하려면 로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">보안 감사 결과</h1>

      {/* 요약 통계 카드 */}
      <div className="section">
        <h2 className="section-title">요약 통계</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          <StatsCard
            title="총 점검 항목"
            value={stats.totalChecks}
            subtitle={`최근 업데이트: ${formatDate(stats.lastCheckedAt)}`}
          />

          <StatsCard
            title="통과"
            value={stats.passedChecks}
            subtitle={`통과율: ${
              stats.totalChecks > 0
                ? Math.round((stats.passedChecks / stats.totalChecks) * 100)
                : 0
            }%`}
            valueColor="color-green"
          />

          <StatsCard
            title="실패"
            value={stats.failedChecks}
            subtitle={`실패율: ${
              stats.totalChecks > 0
                ? Math.round((stats.failedChecks / stats.totalChecks) * 100)
                : 0
            }%`}
            valueColor="color-red"
          />

          <StatsCard
            title="보안 점수"
            value={stats.score}
            subtitle="총점: 100"
            valueColor="color-blue"
          />
        </div>
      </div>

      {/* 일별 통계 시각화 */}
      <div className="section">
        <h2 className="section-title">일별 검사 결과</h2>
        {dailyStats.length > 0 ? (
          <>
            <div style={{ height: "300px", marginTop: "10px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="passed"
                    name="통과"
                    fill="#4caf50"
                    stackId="a"
                  />
                  <Bar
                    dataKey="failed"
                    name="실패"
                    fill="#f44336"
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ marginTop: "20px", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5" }}>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      날짜
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      통과
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      실패
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      통과율
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dailyStats.map((day, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {day.date}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                          color: "#4caf50",
                        }}
                      >
                        {day.passed}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                          color: "#f44336",
                        }}
                      >
                        {day.failed}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {day.passRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            <p>일별 검사 결과 데이터가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 항목별 상세 결과 테이블 */}
      <div className="section">
        <h2 className="section-title">항목별 검사 결과</h2>
        {itemStats.length > 0 ? (
          <div style={{ overflowX: "auto", marginTop: "10px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    항목명
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    카테고리
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    통과
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    실패
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    통과율
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    상세
                  </th>
                </tr>
              </thead>
              <tbody>
                {itemStats.map((item) => (
                  <tr key={item.id} style={{ backgroundColor: "white" }}>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {item.id}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        fontWeight: "500",
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        color: "#666",
                      }}
                    >
                      {item.category}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        color: "#4caf50",
                      }}
                    >
                      {item.passed}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        color: "#f44336",
                      }}
                    >
                      {item.failed}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: "100%",
                            backgroundColor: "#e0e0e0",
                            height: "8px",
                            borderRadius: "4px",
                            marginRight: "8px",
                          }}
                        >
                          <div
                            style={{
                              height: "8px",
                              borderRadius: "4px",
                              width: `${item.passRate}%`,
                              backgroundColor:
                                item.passRate >= 70
                                  ? "#4caf50"
                                  : item.passRate >= 40
                                  ? "#ff9800"
                                  : "#f44336",
                            }}
                          ></div>
                        </div>
                        <span style={{ fontSize: "0.875rem" }}>
                          {item.passRate}%
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <button
                        onClick={() => setSelectedItemId(item.id)}
                        style={{
                          color: "#2196f3",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          padding: "5px",
                          textDecoration: "underline",
                        }}
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            <p>항목별 검사 결과 데이터가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 선택된 항목 상세 정보 */}
      {selectedItem && (
        <div className="section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#e3f2fd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "4px",
            }}
          >
            <div>
              <h2 className="section-title" style={{ marginBottom: "5px" }}>
                {selectedItem.name} 상세 정보
              </h2>
              <p style={{ fontSize: "0.875rem", color: "#666" }}>
                {selectedItem.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedItemId(null)}
              style={{
                color: "#666",
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: "5px 10px",
                fontSize: "0.875rem",
              }}
            >
              닫기
            </button>
          </div>

          {/* 항목 상세 로그 */}
          {selectedItemLogs.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5" }}>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      검사 일시
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      결과
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      실제 값
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      메모
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItemLogs.map((log) => (
                    <tr key={log.log_id} style={{ backgroundColor: "white" }}>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {formatDate(log.checked_at)}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        <span
                          style={{
                            padding: "2px 8px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            borderRadius: "12px",
                            backgroundColor:
                              log.passed === 1 ? "#e8f5e9" : "#ffebee",
                            color: log.passed === 1 ? "#2e7d32" : "#c62828",
                          }}
                        >
                          {log.passed === 1 ? "통과" : "실패"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                          color: "#666",
                        }}
                      >
                        {log.actual_value &&
                          typeof log.actual_value === "object" &&
                          Object.entries(log.actual_value).map(
                            ([key, value]) => (
                              <div key={key}>
                                {key}: {value}
                              </div>
                            )
                          )}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                          color: "#666",
                        }}
                      >
                        <pre
                          style={{
                            fontSize: "0.75rem",
                            backgroundColor: "#f5f5f5",
                            padding: "4px",
                            borderRadius: "4px",
                            fontFamily: "monospace",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {log.notes}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#666" }}
            >
              <p>이 항목에 대한 상세 로그 데이터가 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* 관리자 연락처 */}
      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>
          보안 감사 결과에 대한 문의사항이 있는 경우 아래 담당자에게 문의하세요:
        </p>
        <p>보안 감사팀: 내선 5678 또는 security-audit@example.com</p>
      </div>

      {/* 공통 페이지 네비게이션 컴포넌트 사용 */}
      <PageNavigation currentPath={pathname} />
    </div>
  );
}

// Stats 카드 컴포넌트
function StatsCard({ title, value, subtitle, valueColor = "" }) {
  const getColorClass = () => {
    switch (valueColor) {
      case "color-green":
        return { color: "#4caf50" };
      case "color-red":
        return { color: "#f44336" };
      case "color-blue":
        return { color: "#2196f3" };
      default:
        return { color: "#333" };
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "4px",
        padding: "15px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3
        style={{
          fontSize: "0.875rem",
          fontWeight: "500",
          color: "#666",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "8px",
          ...getColorClass(),
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: "0.875rem", color: "#666" }}>{subtitle}</p>
    </div>
  );
}