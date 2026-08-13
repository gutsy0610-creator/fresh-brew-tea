import React, { useRef } from 'react';
import { useLearningData } from '../hooks/useLearningData';

const Stats: React.FC = () => {
  const { stats, incorrectRecords, progress, resetAll, saveStats, saveIncorrect } = useLearningData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalProgress = Math.round((progress.length / 200) * 100) || 0;
  const accuracy = stats.totalSolved > 0 ? Math.round((stats.totalCorrect / stats.totalSolved) * 100) : 0;
  const derivedAccuracy = stats.derivedStats.solved > 0 ? Math.round((stats.derivedStats.correct / stats.derivedStats.solved) * 100) : 0;

  const handleBackup = () => {
    const data = { stats, incorrectRecords, progress };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goldenbell_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.stats && data.incorrectRecords && data.progress) {
          saveStats(data.stats);
          saveIncorrect(data.incorrectRecords);
          localStorage.setItem('goldenbell_progress', JSON.stringify(data.progress));
          alert('데이터가 성공적으로 복원되었습니다.');
          window.location.reload();
        } else {
          alert('올바르지 않은 백업 파일입니다.');
        }
      } catch (err) {
        alert('파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('정말로 모든 학습 기록을 초기화하시겠습니까? (이 작업은 되돌릴 수 없습니다)')) {
      if (window.confirm('진짜 확실하신가요? 모든 오답 기록과 진행률이 삭제됩니다.')) {
        resetAll();
        alert('모든 기록이 초기화되었습니다.');
        window.location.reload();
      }
    }
  };

  return (
    <div className="page-container animate-fade-in flex-column gap-md">
      <h2>📊 나의 학습기록</h2>
      
      <div className="card text-center" style={{ backgroundColor: 'var(--main-blue)', color: 'white' }}>
        <h3 style={{ color: 'white', marginBottom: '8px' }}>요약 지표</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 700 }}>{totalProgress}%</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>전체 학습률</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 700 }}>{accuracy}%</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>전체 정답률</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 700 }}>{stats.todaySolved}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>오늘 푼 문제</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 700 }}>{stats.consecutiveDays}일</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>연속 학습</div>
          </div>
        </div>
      </div>

      <div className="card flex-column gap-md">
        <h3>세부 지표</h3>
        
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>단원별 정답률</div>
          {[1, 2, 3, 4].map(ch => {
            const s = stats.chapterStats[ch] || { solved: 0, correct: 0 };
            const acc = s.solved > 0 ? Math.round((s.correct / s.solved) * 100) : 0;
            return (
              <div key={ch} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                <span>{ch}단원</span>
                <span>{acc}% ({s.correct}/{s.solved})</span>
              </div>
            );
          })}
        </div>

        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>유형별 정답률</div>
          {['객관식', '주관식', 'OX'].map(type => {
            const s = stats.typeStats[type] || { solved: 0, correct: 0 };
            const acc = s.solved > 0 ? Math.round((s.correct / s.solved) * 100) : 0;
            return (
              <div key={type} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                <span>{type}</span>
                <span>{acc}% ({s.correct}/{s.solved})</span>
              </div>
            );
          })}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px', marginTop: '8px', color: 'var(--main-blue)' }}>
            <span>응용문제 정답률</span>
            <span>{derivedAccuracy}% ({stats.derivedStats.correct}/{stats.derivedStats.solved})</span>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>기타 통계</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
            <span>아직 풀지 않은 원본 문제</span>
            <span>{200 - progress.length}개</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
            <span>복습 완료된 문제</span>
            <span>{incorrectRecords.filter(r => r.isReviewed).length}개</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px', color: 'var(--point-yellow-dark)', fontWeight: 600 }}>
            <span>실전 골든벨 최고 점수</span>
            <span>{stats.goldenBellHighScore}점</span>
          </div>
        </div>
      </div>

      <div className="card flex-column gap-md">
        <h3>데이터 관리</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>브라우저를 변경하거나 기기를 바꿀 때 데이터를 옮길 수 있습니다.</p>
        
        <button className="btn-outline" onClick={handleBackup}>💾 데이터 백업 (다운로드)</button>
        <button className="btn-outline" onClick={() => fileInputRef.current?.click()}>📂 데이터 복원 (불러오기)</button>
        <input type="file" accept=".json" style={{ display: 'none' }} ref={fileInputRef} onChange={handleRestore} />
        
        <button className="btn-outline" style={{ borderColor: 'var(--incorrect-coral)', color: 'var(--incorrect-coral)', marginTop: '16px' }} onClick={handleReset}>
          ⚠️ 전체 데이터 초기화
        </button>
      </div>
    </div>
  );
};

export default Stats;
