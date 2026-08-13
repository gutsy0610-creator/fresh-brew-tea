import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearningData } from '../hooks/useLearningData';
import questionsData from '../data/questions.json';
import type { Question } from '../types';
import ExplanationText from '../components/ExplanationText';

const Review: React.FC = () => {
  const navigate = useNavigate();
  const { incorrectRecords } = useLearningData();

  const [filterMode, setFilterMode] = useState('unreviewed'); // unreviewed, all
  
  const records = filterMode === 'unreviewed' 
    ? incorrectRecords.filter(r => !r.isReviewed)
    : incorrectRecords;

  const handleStartReview = () => {
    navigate('/solve');
    // Note: To pass state to QuestionSolve directly, we could use React Router state.
    // For simplicity, users can select '틀린 문제 복습' directly from QuestionSolve setup,
    // so we can just redirect them there and tell them to select it.
    alert('공개문제 풀기 메뉴에서 [틀린 문제 복습]을 선택하여 시작해주세요!');
  };

  return (
    <div className="page-container animate-fade-in flex-column gap-md">
      <h2>🔄 오답 복습</h2>
      
      <div className="card text-center" style={{ backgroundColor: 'var(--incorrect-light)', border: '1px solid var(--incorrect-coral)' }}>
        <h3 style={{ color: 'var(--incorrect-coral)' }}>현재 복습 필요 문제</h3>
        <div style={{ fontSize: '32px', fontWeight: 700, margin: '16px 0', color: 'var(--main-dark)' }}>
          {incorrectRecords.filter(r => !r.isReviewed).length}개
        </div>
        <p style={{ fontSize: '12px', margin: 0 }}>* 두 번 연속 정답을 맞히면 복습 완료 처리됩니다.</p>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          className={filterMode === 'unreviewed' ? 'btn-primary' : 'btn-outline'} 
          style={{ flex: 1 }}
          onClick={() => setFilterMode('unreviewed')}
        >
          복습 필요
        </button>
        <button 
          className={filterMode === 'all' ? 'btn-primary' : 'btn-outline'} 
          style={{ flex: 1 }}
          onClick={() => setFilterMode('all')}
        >
          전체 오답
        </button>
      </div>

      {records.length === 0 ? (
        <div className="card text-center" style={{ padding: '40px 20px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎉</div>
          <h3>오답이 없습니다!</h3>
          <p style={{ marginTop: '8px' }}>완벽하게 학습하고 계시네요.</p>
        </div>
      ) : (
        <div className="flex-column gap-md">
          {records.map((r, idx) => (
            <div key={idx} className="card" style={{ opacity: r.isReviewed ? 0.7 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--main-blue)', fontWeight: 600 }}>원본 {r.originalNumber}번 ({r.chapter}단원)</span>
                {r.isReviewed && <span style={{ fontSize: '12px', color: 'var(--correct-green)', fontWeight: 600 }}>복습 완료 ✅</span>}
                {!r.isReviewed && <span style={{ fontSize: '12px', color: 'var(--incorrect-coral)', fontWeight: 600 }}>틀린 횟수: {r.incorrectCount}회</span>}
              </div>
              <h4 style={{ marginBottom: '8px', lineHeight: 1.4 }}>{r.question}</h4>
              
              {r.originalType === '객관식' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  {(() => {
                    const originalQ = (questionsData as Question[]).find(q => q.originalNumber === r.originalNumber);
                    return originalQ?.choices.map((choice, idx) => (
                      <div key={idx}>{idx + 1}. {choice}</div>
                    ));
                  })()}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', backgroundColor: 'var(--surface-color-hover)', padding: '12px', borderRadius: '8px' }}>
                <div><span style={{ color: 'var(--incorrect-coral)', fontWeight: 600 }}>내가 적은 답:</span> {r.userAnswer || '(입력 안함)'}</div>
                <div><span style={{ color: 'var(--correct-green)', fontWeight: 600 }}>정확한 정답:</span> {r.correctAnswer}</div>
              </div>
              
              <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--main-light)', borderRadius: '8px' }}>
                <strong style={{ fontSize: '14px', color: 'var(--main-dark)' }}>📖 해설</strong>
                {(() => {
                  const originalQ = (questionsData as Question[]).find(q => q.originalNumber === r.originalNumber);
                  return <ExplanationText text={r.explanation} keywords={originalQ ? [...originalQ.keywords, originalQ.correctAnswer] : [r.correctAnswer]} />;
                })()}
              </div>
            </div>
          ))}
          <button className="btn-primary" style={{ marginTop: '16px' }} onClick={handleStartReview}>다시 풀기 모드로 가기</button>
        </div>
      )}
    </div>
  );
};

export default Review;
