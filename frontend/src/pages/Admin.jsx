import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Upload, Download, RefreshCw } from 'lucide-react';
import questionsDataRaw from '../data/questions.json';

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: questionsDataRaw.length,
    sources: [...new Set(questionsDataRaw.map(q => q.source))]
  });

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> 나가기
        </button>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
          관리자 대시보드
        </div>
        <div></div>
      </div>

      <div className="glass-panel" style={{ marginBottom: '30px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Database size={24} color="var(--primary-color)" /> 데이터베이스 현황
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>총 문제 수</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>{stats.total}</div>
          </div>
          <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>출처 개수</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary-dark)' }}>{stats.sources.length}</div>
          </div>
        </div>

        <h3 style={{ marginBottom: '15px' }}>등록된 출처 목록</h3>
        <ul style={{ background: 'var(--bg-color)', padding: '20px 40px', borderRadius: '12px', lineHeight: '2' }}>
          {stats.sources.map(s => (
            <li key={s} style={{ color: 'var(--text-main)', fontWeight: '500' }}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="features-grid" style={{ marginTop: '0' }}>
        <div className="feature-card" style={{ padding: '20px' }}>
          <Upload size={32} color="var(--primary-color)" style={{ marginBottom: '10px' }} />
          <h4>문제 업데이트</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px' }}>새로운 JSON 파일을 업로드하여 문제를 갱신합니다.</p>
          <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem', padding: '10px' }}>파일 선택</button>
        </div>
        
        <div className="feature-card" style={{ padding: '20px' }}>
          <Download size={32} color="var(--secondary-dark)" style={{ marginBottom: '10px' }} />
          <h4>데이터 백업</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px' }}>현재 문제 DB를 JSON 파일로 다운로드합니다.</p>
          <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.9rem', padding: '10px' }}>다운로드</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
