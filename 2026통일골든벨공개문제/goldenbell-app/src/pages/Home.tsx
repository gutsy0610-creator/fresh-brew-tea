import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearningData } from '../hooks/useLearningData';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { stats, progress } = useLearningData();

  const totalProgress = Math.round((progress.length / 200) * 100) || 0;
  const accuracy = stats.totalSolved > 0 ? Math.round((stats.totalCorrect / stats.totalSolved) * 100) : 0;
  
  // Find the most incorrect chapter
  let worstChapter = '-';
  let minAccuracy = 100;
  Object.keys(stats.chapterStats).forEach(ch => {
    const chStat = stats.chapterStats[Number(ch)];
    if (chStat.solved > 0) {
      const acc = (chStat.correct / chStat.solved) * 100;
      if (acc < minAccuracy) {
        minAccuracy = acc;
        worstChapter = `${ch}단원`;
      }
    }
  });

  return (
    <div className="animate-fade-in flex-column gap-lg">
      <div className="card text-center" style={{ backgroundColor: 'var(--main-blue)', color: 'white' }}>
        <h2 style={{ color: 'white', marginBottom: 'var(--spacing-sm)' }}>오늘의 학습 요약</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 'var(--spacing-md)' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.todaySolved}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>오늘 푼 문제</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.consecutiveDays}일</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>연속 학습</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{accuracy}%</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>전체 정답률</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>전체 학습 진행률</h3>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>{progress.length} / 200 문제</span>
            <span style={{ fontWeight: 'bold' }}>{totalProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${totalProgress}%`, height: '100%', backgroundColor: 'var(--correct-green)', transition: 'width 0.5s ease' }}></div>
          </div>
        </div>
      </div>

      <div className="card flex-column gap-md">
        <h3>취약 분석</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ color: 'var(--text-muted)' }}>가장 많이 틀린 단원</span>
          <span style={{ fontWeight: 600, color: 'var(--incorrect-coral)' }}>{worstChapter}</span>
        </div>
      </div>

      <button className="btn-primary" style={{ width: '100%', minHeight: '56px', fontSize: '18px' }} onClick={() => navigate('/solve')}>
        🚀 최근 학습 이어하기
      </button>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
        <button className="btn-secondary" style={{ flexDirection: 'column', height: '100px', gap: '8px' }} onClick={() => navigate('/flashcards')}>
          <span style={{ fontSize: '24px' }}>📇</span>
          <span>핵심 암기</span>
        </button>
        <button className="btn-secondary" style={{ flexDirection: 'column', height: '100px', gap: '8px' }} onClick={() => navigate('/review')}>
          <span style={{ fontSize: '24px' }}>🔄</span>
          <span>오답 복습</span>
        </button>
        <button className="btn-accent" style={{ flexDirection: 'column', height: '100px', gap: '8px' }} onClick={() => navigate('/derived')}>
          <span style={{ fontSize: '24px' }}>💡</span>
          <span>해설 응용문제</span>
        </button>
        <button className="btn-outline" style={{ flexDirection: 'column', height: '100px', gap: '8px', borderColor: 'var(--point-yellow-dark)', color: 'var(--point-yellow-dark)' }} onClick={() => navigate('/goldenbell')}>
          <span style={{ fontSize: '24px' }}>🔔</span>
          <span>실전 골든벨</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
