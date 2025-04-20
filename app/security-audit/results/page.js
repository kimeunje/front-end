'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PageNavigation from '@/app/components/PageNavigation';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, ResponsiveContainer
} from 'recharts';

export default function SecurityAuditStatsDashboard() {
  const pathname = usePathname();

  // 통계 데이터 상태
  const [stats, setStats] = useState({
    totalChecks: 0,
    passedChecks: 0,
    failedChecks: 0,
    lastCheckedAt: '',
    score: 0
  });

  // 보안 점검 항목 데이터
  const [checklistItems, setChecklistItems] = useState([
    { id: 7, name: '암호 복잡성 요구 사항', category: '패스워드 정책', description: '암호에 대문자, 소문자, 숫자, 특수문자 중 3종류 이상을 포함해야 함' },
    { id: 8, name: '최대 암호 사용 기간', category: '패스워드 정책', description: '암호는 최대 90일 이내로 변경되어야 함' },
    { id: 9, name: '암호 기록 크기', category: '패스워드 정책', description: '최근 사용한 5개의 암호는 재사용할 수 없음' },
  ]);

  // 검사 결과 로그 데이터
  const [auditLogs, setAuditLogs] = useState([
    {
      log_id: 242,
      user_id: 1,
      item_id: 7,
      actual_value: { passwordComplexity: "1" },
      passed: 1,
      notes: "{'passwordComplexity': '1', 'minimumPasswordLength': '8', 'maximumPasswordAge': '31', 'passwordHistorySize': '5'}",
      checked_at: '2025-04-07 04:59:16'
    },
    {
      log_id: 243,
      user_id: 1,
      item_id: 8,
      actual_value: { maximumPasswordAge: "31" },
      passed: 0,
      notes: "{'passwordComplexity': '1', 'minimumPasswordLength': '8', 'maximumPasswordAge': '31', 'passwordHistorySize': '5'}",
      checked_at: '2025-04-07 04:59:16'
    },
    {
      log_id: 244,
      user_id: 1,
      item_id: 9,
      actual_value: { passwordHistorySize: "5" },
      passed: 1,
      notes: "{'passwordComplexity': '1', 'minimumPasswordLength': '8', 'maximumPasswordAge': '31', 'passwordHistorySize': '5'}",
      checked_at: '2025-04-07 04:59:16'
    },
    // 이전 데이터 추가 (시각화를 위한 데모 데이터)
    {
      log_id: 231,
      user_id: 1,
      item_id: 7,
      actual_value: { passwordComplexity: "1" },
      passed: 1,
      notes: "{'passwordComplexity': '1', 'minimumPasswordLength': '8', 'maximumPasswordAge': '31', 'passwordHistorySize': '5'}",
      checked_at: '2025-04-06 04:59:16'
    },
    {
      log_id: 232,
      user_id: 1,
      item_id: 8,
      actual_value: { maximumPasswordAge: "31" },
      passed: 0,
      notes: "{'passwordComplexity': '1', 'minimumPasswordLength': '8', 'maximumPasswordAge': '31', 'passwordHistorySize': '5'}",
      checked_at: '2025-04-06 04:59:16'
    },
    {
      log_id: 233,
      user_id: 1,
      item_id: 9,
      actual_value: { passwordHistorySize: "5" },
      passed: 0,
      notes: "{'passwordComplexity': '1', 'minimumPasswordLength': '8', 'maximumPasswordAge': '31', 'passwordHistorySize': '5'}",
      checked_at: '2025-04-06 04:59:16'
    },
    {
      log_id: 221,
      user_id: 1,
      item_id: 7,
      actual_value: { passwordComplexity: "0" },
      passed: 0,
      notes: "{'passwordComplexity': '0', 'minimumPasswordLength': '6', 'maximumPasswordAge': '180', 'passwordHistorySize': '3'}",
      checked_at: '2025-04-05 04:59:16'
    },
    {
      log_id: 222,
      user_id: 1,
      item_id: 8,
      actual_value: { maximumPasswordAge: "180" },
      passed: 0,
      notes: "{'passwordComplexity': '0', 'minimumPasswordLength': '6', 'maximumPasswordAge': '180', 'passwordHistorySize': '3'}",
      checked_at: '2025-04-05 04:59:16'
    },
    {
      log_id: 223,
      user_id: 1,
      item_id: 9,
      actual_value: { passwordHistorySize: "3" },
      passed: 0,
      notes: "{'passwordComplexity': '0', 'minimumPasswordLength': '6', 'maximumPasswordAge': '180', 'passwordHistorySize': '3'}",
      checked_at: '2025-04-05 04:59:16'
    },
  ]);

  // 선택된 항목 ID (상세 정보 표시용)
  const [selectedItemId, setSelectedItemId] = useState(null);

  // 시간별로 그룹화된 로그 (최근 7일)
  const [dailyStats, setDailyStats] = useState([]);

  // 항목별 통과/실패 통계
  const [itemStats, setItemStats] = useState([]);

  // 초기 데이터 처리
  useEffect(() => {
    // 통계 계산
    const totalChecks = auditLogs.length;
    const passedChecks = auditLogs.filter(log => log.passed === 1).length;
    const failedChecks = totalChecks - passedChecks;

    // 가장 최근 검사 날짜
    const sortedLogs = [...auditLogs].sort((a, b) =>
      new Date(b.checked_at) - new Date(a.checked_at)
    );
    const lastCheckedAt = sortedLogs.length > 0 ? sortedLogs[0].checked_at : '';

    // 점수 계산 (통과율 * 100)
    const score = Math.round((passedChecks / totalChecks) * 100);

    setStats({
      totalChecks,
      passedChecks,
      failedChecks,
      lastCheckedAt,
      score
    });

    // 일별 통계 준비
    prepareDailyStats();

    // 항목별 통계 준비
    prepareItemStats();
  }, [auditLogs]);

  // 일별 통계 준비 함수
  const prepareDailyStats = () => {
    // 날짜별로 로그를 그룹화
    const groupedByDate = {};

    auditLogs.forEach(log => {
      const dateOnly = log.checked_at.split(' ')[0];
      if (!groupedByDate[dateOnly]) {
        groupedByDate[dateOnly] = { date: dateOnly, passed: 0, failed: 0 };
      }

      if (log.passed === 1) {
        groupedByDate[dateOnly].passed += 1;
      } else {
        groupedByDate[dateOnly].failed += 1;
      }
    });

    // 날짜순으로 정렬
    const sortedDates = Object.values(groupedByDate).sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );

    // Recharts에서 사용하기 쉽게 데이터 구조 조정
    const chartData = sortedDates.map(day => {
      const total = day.passed + day.failed;
      const passRate = total > 0 ? Math.round((day.passed / total) * 100) : 0;

      return {
        ...day,
        passRate,
        total
      };
    });

    setDailyStats(chartData);
  };

  // 항목별 통계 준비 함수
  const prepareItemStats = () => {
    const itemStatsData = checklistItems.map(item => {
      const itemLogs = auditLogs.filter(log => log.item_id === item.id);
      const passedCount = itemLogs.filter(log => log.passed === 1).length;
      const failedCount = itemLogs.length - passedCount;
      const passRate = itemLogs.length > 0 ? (passedCount / itemLogs.length) * 100 : 0;

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        total: itemLogs.length,
        passed: passedCount,
        failed: failedCount,
        passRate: Math.round(passRate)
      };
    });

    setItemStats(itemStatsData);
  };

  // 항목 상세 로그 조회
  const getItemLogs = (itemId) => {
    return auditLogs
      .filter(log => log.item_id === itemId)
      .sort((a, b) => new Date(b.checked_at) - new Date(a.checked_at));
  };

  // 날짜 포맷 함수
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 선택된 항목의 로그
  const selectedItemLogs = selectedItemId ? getItemLogs(selectedItemId) : [];

  // 선택된 항목 정보
  const selectedItem = checklistItems.find(item => item.id === selectedItemId);

  return (
    <div>
      <h1 className="page-title">보안 감사 결과</h1>
      
      {/* 요약 통계 카드 */}
      <div className="section">
        <h2 className="section-title">요약 통계</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '10px' }}>
          <StatsCard
            title="총 점검 항목"
            value={stats.totalChecks}
            subtitle={`최근 업데이트: ${formatDate(stats.lastCheckedAt)}`}
          />

          <StatsCard
            title="통과"
            value={stats.passedChecks}
            subtitle={`통과율: ${Math.round((stats.passedChecks / stats.totalChecks) * 100)}%`}
            valueColor="color-green"
          />

          <StatsCard
            title="실패"
            value={stats.failedChecks}
            subtitle={`실패율: ${Math.round((stats.failedChecks / stats.totalChecks) * 100)}%`}
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
        <div style={{ height: '300px', marginTop: '10px' }}>
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
              <Bar dataKey="passed" name="통과" fill="#4caf50" stackId="a" />
              <Bar dataKey="failed" name="실패" fill="#f44336" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>날짜</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>통과</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>실패</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>통과율</th>
              </tr>
            </thead>
            <tbody>
              {dailyStats.map((day, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{day.date}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd', color: '#4caf50' }}>{day.passed}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd', color: '#f44336' }}>{day.failed}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{day.passRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 항목별 상세 결과 테이블 */}
      <div className="section">
        <h2 className="section-title">항목별 검사 결과</h2>
        <div style={{ overflowX: 'auto', marginTop: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>항목명</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>카테고리</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>통과</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>실패</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>통과율</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>상세</th>
              </tr>
            </thead>
            <tbody>
              {itemStats.map(item => (
                <tr key={item.id} style={{ backgroundColor: 'white' }}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.id}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd', fontWeight: '500' }}>{item.name}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd', color: '#666' }}>{item.category}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd', color: '#4caf50' }}>{item.passed}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd', color: '#f44336' }}>{item.failed}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '100%', 
                        backgroundColor: '#e0e0e0', 
                        height: '8px', 
                        borderRadius: '4px', 
                        marginRight: '8px' 
                      }}>
                        <div
                          style={{ 
                            height: '8px', 
                            borderRadius: '4px',
                            width: `${item.passRate}%`,
                            backgroundColor: item.passRate >= 70 ? '#4caf50' : item.passRate >= 40 ? '#ff9800' : '#f44336'
                          }}
                        ></div>
                      </div>
                      <span style={{ fontSize: '0.875rem' }}>{item.passRate}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    <button
                      onClick={() => setSelectedItemId(item.id)}
                      style={{ 
                        color: '#2196f3', 
                        border: 'none', 
                        background: 'none', 
                        cursor: 'pointer',
                        padding: '5px',
                        textDecoration: 'underline'
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
      </div>

      {/* 선택된 항목 상세 정보 */}
      {selectedItem && (
        <div className="section">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: '#e3f2fd', 
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '4px'
          }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: '5px' }}>{selectedItem.name} 상세 정보</h2>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>{selectedItem.description}</p>
            </div>
            <button
              onClick={() => setSelectedItemId(null)}
              style={{ 
                color: '#666', 
                border: 'none', 
                background: 'none', 
                cursor: 'pointer',
                padding: '5px 10px',
                fontSize: '0.875rem'
              }}
            >
              닫기
            </button>
          </div>

          {/* 항목 상세 로그 */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>검사 일시</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>결과</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>실제 값</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>메모</th>
                </tr>
              </thead>
              <tbody>
                {selectedItemLogs.map(log => (
                  <tr key={log.log_id} style={{ backgroundColor: 'white' }}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{formatDate(log.checked_at)}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                      <span style={{
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '12px',
                        backgroundColor: log.passed === 1 ? '#e8f5e9' : '#ffebee',
                        color: log.passed === 1 ? '#2e7d32' : '#c62828'
                      }}>
                        {log.passed === 1 ? '통과' : '실패'}
                      </span>
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd', color: '#666' }}>
                      {Object.entries(log.actual_value).map(([key, value]) => (
                        <div key={key}>{key}: {value}</div>
                      ))}
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd', color: '#666' }}>
                      <pre style={{ 
                        fontSize: '0.75rem', 
                        backgroundColor: '#f5f5f5', 
                        padding: '4px', 
                        borderRadius: '4px', 
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {log.notes}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 관리자 연락처 */}
      <div className="section">
        <h2 className="section-title">관리자 연락처</h2>
        <p>보안 감사 결과에 대한 문의사항이 있는 경우 아래 담당자에게 문의하세요:</p>
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
    switch(valueColor) {
      case 'color-green':
        return { color: '#4caf50' };
      case 'color-red':
        return { color: '#f44336' };
      case 'color-blue':
        return { color: '#2196f3' };
      default:
        return { color: '#333' };
    }
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '4px', 
      padding: '15px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#666', marginBottom: '8px' }}>{title}</h3>
      <p style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        marginBottom: '8px',
        ...getColorClass()
      }}>{value}</p>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>{subtitle}</p>
    </div>
  );
}