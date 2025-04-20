// app/security-audit/results/StatsDashboard.js
'use client';

import React, { useState, useEffect } from 'react';

export default function SecurityAuditStatsDashboard() {
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
    
    setDailyStats(sortedDates);
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
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', color: '#333', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 헤더 */}
      <div style={{ backgroundColor: '#3f51b5', color: 'white', padding: '1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>보안 감사 결과</h1>
        </div>
      </div>
      
      {/* 대시보드 내용 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        {/* 요약 통계 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', padding: '1.5rem' }}>
            <h3 style={{ color: '#666', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>총 점검 항목</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{stats.totalChecks}</p>
            <p style={{ color: '#666', fontSize: '0.875rem', margin: 0 }}>최근 업데이트: {formatDate(stats.lastCheckedAt)}</p>
          </div>
          
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', padding: '1.5rem' }}>
            <h3 style={{ color: '#666', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>통과</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#4caf50' }}>{stats.passedChecks}</p>
            <p style={{ color: '#666', fontSize: '0.875rem', margin: 0 }}>통과율: {Math.round((stats.passedChecks / stats.totalChecks) * 100)}%</p>
          </div>
          
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', padding: '1.5rem' }}>
            <h3 style={{ color: '#666', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>실패</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#f44336' }}>{stats.failedChecks}</p>
            <p style={{ color: '#666', fontSize: '0.875rem', margin: 0 }}>실패율: {Math.round((stats.failedChecks / stats.totalChecks) * 100)}%</p>
          </div>
          
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', padding: '1.5rem' }}>
            <h3 style={{ color: '#666', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>보안 점수</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#2196f3' }}>{stats.score}</p>
            <p style={{ color: '#666', fontSize: '0.875rem', margin: 0 }}>총점: 100</p>
          </div>
        </div>
        
        {/* 일별 통계 시각화 */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>일별 검사 결과</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.75rem', borderBottom: '2px solid #e0e0e0' }}>날짜</th>
                  <th style={{ padding: '0.75rem', borderBottom: '2px solid #e0e0e0' }}>통과</th>
                  <th style={{ padding: '0.75rem', borderBottom: '2px solid #e0e0e0' }}>실패</th>
                  <th style={{ padding: '0.75rem', borderBottom: '2px solid #e0e0e0' }}>통과율</th>
                  <th style={{ padding: '0.75rem', borderBottom: '2px solid #e0e0e0' }}>시각화</th>
                </tr>
              </thead>
              <tbody>
                {dailyStats.map((day, index) => {
                  const total = day.passed + day.failed;
                  const passRate = total > 0 ? Math.round((day.passed / total) * 100) : 0;
                  
                  return (
                    <tr key={index}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #e0e0e0' }}>{day.date}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #e0e0e0', color: '#4caf50' }}>{day.passed}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #e0e0e0', color: '#f44336' }}>{day.failed}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #e0e0e0' }}>{passRate}%</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #e0e0e0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '20px' }}>
                          <div style={{ backgroundColor: '#4caf50', height: '100%', width: `${day.passed * 30}px` }}></div>
                          <div style={{ backgroundColor: '#f44336', height: '100%', width: `${day.failed * 30}px` }}></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 항목별 상세 결과 테이블 */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e0e0e0' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>항목별 검사 결과</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9f9f9' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #e0e0e0' }}>ID</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #e0e0e0' }}>항목명</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #e0e0e0' }}>카테고리</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #e0e0e0' }}>통과</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #e0e0e0' }}>실패</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #e0e0e0' }}>통과율</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #e0e0e0' }}>상세</th>
                </tr>
              </thead>
              <tbody>
                {itemStats.map(item => (
                  <tr key={item.id}>
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', borderBottom: '1px solid #e0e0e0' }}>{item.id}</td>
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: '500', borderBottom: '1px solid #e0e0e0' }}>{item.name}</td>
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>{item.category}</td>
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#4caf50', borderBottom: '1px solid #e0e0e0' }}>{item.passed}</td>
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#f44336', borderBottom: '1px solid #e0e0e0' }}>{item.failed}</td>
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', borderBottom: '1px solid #e0e0e0' }}>
                      <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '9999px', height: '8px', marginBottom: '4px', position: 'relative' }}>
                        <div 
                          style={{ 
                            height: '8px', 
                            borderRadius: '9999px', 
                            width: `${item.passRate}%`,
                            backgroundColor: item.passRate >= 70 ? '#4caf50' : item.passRate >= 40 ? '#ff9800' : '#f44336'
                          }}
                        ></div>
                      </div>
                      <span style={{ fontSize: '0.75rem' }}>{item.passRate}%</span>
                    </td>
                    <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>
                      <button 
                        onClick={() => setSelectedItemId(item.id)}
                        style={{ color: '#2196f3', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
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
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#e3f2fd', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>{selectedItem.name} 상세 정보</h2>
                <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>{selectedItem.description}</p>
              </div>
              <button 
                onClick={() => setSelectedItemId(null)}
                style={{ color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                닫기
              </button>
            </div>
            
            {/* 항목 상세 로그 */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9f9f9' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #e0e0e0' }}>검사 일시</th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #e0e0e0' }}>결과</th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #e0e0e0' }}>실제 값</th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #e0e0e0' }}>메모</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItemLogs.map(log => (
                    <tr key={log.log_id}>
                      <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', borderBottom: '1px solid #e0e0e0' }}>{formatDate(log.checked_at)}</td>
                      <td style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #e0e0e0' }}>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          borderRadius: '9999px',
                          backgroundColor: log.passed === 1 ? '#e8f5e9' : '#ffebee',
                          color: log.passed === 1 ? '#2e7d32' : '#c62828'
                        }}>
                          {log.passed === 1 ? '통과' : '실패'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>
                        {Object.entries(log.actual_value).map(([key, value]) => (
                          <div key={key}>{key}: {value}</div>
                        ))}
                      </td>
                      <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>
                        <pre style={{ 
                          margin: 0, 
                          fontSize: '0.75rem', 
                          backgroundColor: '#f5f5f5', 
                          padding: '0.25rem', 
                          borderRadius: '0.25rem',
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap'
                        }}>{log.notes}</pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}