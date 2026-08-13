import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questionsData from '../data/questions.json';
import { Question } from '../types';
import { useLearningData } from '../hooks/useLearningData';
import { isCorrectSubjective, shuffleArray } from '../utils/scoring';

const QuestionSolve: React.FC = () => {
  const navigate = useNavigate();
  const { progress, incorrectRecords, recordResult } = useLearningData();

  const [setupMode, setSetupMode] = useState(true);
  const [filterCh, setFilterCh] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // all, uncompleted, incorrect
  const [countLimit, setCountLimit] = useState(0); // 0 means all

  const [quizQueue, setQuizQueue] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleStart = () => {
    let list = [...(questionsData as Question[])];
    
    if (filterCh !== 'all') {
      list = list.filter(q => q.chapter === parseInt(filterCh));
    }
    if (filterType !== 'all') {
      list = list.filter(q => q.originalType === filterType);
    }
    if (filterStatus === 'uncompleted') {
      list = list.filter(q => !progress.includes(q.originalNumber));
    } else if (filterStatus === 'incorrect') {
      const incorrectIds = incorrectRecords.filter(r => !r.isReviewed).map(r => r.originalNumber);
      list = list.filter(q => incorrectIds.includes(q.originalNumber));
    }

    if (countLimit > 0 && list.length > countLimit) {
      list = shuffleArray(list).slice(0, countLimit);
    }

    if (list.length === 0) {
      alert('선택한 조건에 맞는 문제가 없습니다.');
      return;
    }

    setQuizQueue(list);
    setCurrentIndex(0);
    setSetupMode(false);
    prepareQuestion(list[0]);
  };

  const prepareQuestion = (q: Question) => {
    setUserAnswer('');
    setShowResult(false);
    if (q.originalType === '객관식') {
      setCurrentChoices(shuffleArray(q.choices));
    } else {
      setCurrentChoices([]);
    }
  };

  const checkAnswer = () => {
    if (!userAnswer) {
      alert('답을 입력하거나 선택해주세요.');
      return;
    }

    const q = quizQueue[currentIndex];
    let correct = false;
    
    if (q.originalType === '객관식' || q.originalType === 'OX') {
      correct = (userAnswer === q.correctAnswer);
    } else {
      correct = isCorrectSubjective(userAnswer, q.acceptedAnswers);
    }

    setIsCorrect(correct);
    setShowResult(true);
    recordResult(q, correct, userAnswer);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < quizQueue.length) {
      setCurrentIndex(currentIndex + 1);
      prepareQuestion(quizQueue[currentIndex + 1]);
    } else {
      alert('모든 문제를 풀었습니다!');
      setSetupMode(true);
    }
  };

  if (setupMode) {
    return (
      <div className="page-container animate-fade-in flex-column gap-md">
        <h2>공개문제 풀기</h2>
        <div className="card flex-column gap-md">
          <label>단원 선택</label>
          <select value={filterCh} onChange={e => setFilterCh(e.target.value)} style={{ padding: '12px' }}>
            <option value="all">전체</option>
            <option value="1">1. 분단에 대한 인식</option>
            <option value="2">2. 평화통일에 대한 역사적 접근</option>
            <option value="3">3. 북한에 대한 이해</option>
            <option value="4">4. 한반도 평화통일의 미래</option>
          </select>

          <label>문제 유형</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '12px' }}>
            <option value="all">전체 유형</option>
            <option value="객관식">객관식만</option>
            <option value="주관식">주관식만</option>
            <option value="OX">OX만</option>
          </select>

          <label>학습 상태</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '12px' }}>
            <option value="all">전체 문제</option>
            <option value="uncompleted">아직 풀지 않은 문제만</option>
            <option value="incorrect">틀린 문제 복습</option>
          </select>

          <label>문제 개수</label>
          <select value={countLimit} onChange={e => setCountLimit(Number(e.target.value))} style={{ padding: '12px' }}>
            <option value={0}>조건에 맞는 전체</option>
            <option value={10}>10문제</option>
            <option value={20}>20문제</option>
            <option value={50}>50문제</option>
          </select>

          <button className="btn-primary" style={{ marginTop: '16px' }} onClick={handleStart}>풀기 시작</button>
        </div>
      </div>
    );
  }

  const q = quizQueue[currentIndex];

  return (
    <div className="page-container animate-fade-in flex-column gap-md" style={{ paddingBottom: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
        <span>{q.chapterTitle}</span>
        <span>{currentIndex + 1} / {quizQueue.length}</span>
      </div>

      <div className="card">
        <div style={{ fontSize: '14px', color: 'var(--main-blue)', marginBottom: '8px', fontWeight: 600 }}>공개문제 원본 {q.originalNumber}번</div>
        <h3 style={{ fontSize: '20px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{q.question}</h3>
      </div>

      {!showResult ? (
        <div className="flex-column gap-sm">
          {q.originalType === '객관식' && currentChoices.map((choice, i) => (
            <button 
              key={i} 
              className={userAnswer === choice ? 'btn-primary' : 'btn-outline'}
              style={{ justifyContent: 'flex-start', textAlign: 'left', minHeight: '56px' }}
              onClick={() => setUserAnswer(choice)}
            >
              {i + 1}. {choice}
            </button>
          ))}
          {q.originalType === 'OX' && (
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className={userAnswer === 'O' ? 'btn-primary' : 'btn-outline'} style={{ flex: 1, height: '100px', fontSize: '48px' }} onClick={() => setUserAnswer('O')}>O</button>
              <button className={userAnswer === 'X' ? 'btn-primary' : 'btn-outline'} style={{ flex: 1, height: '100px', fontSize: '48px' }} onClick={() => setUserAnswer('X')}>X</button>
            </div>
          )}
          {q.originalType === '주관식' && (
            <input 
              type="text" 
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              placeholder="정답을 입력하세요"
              style={{ padding: '16px', fontSize: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', width: '100%' }}
            />
          )}

          <button className="btn-primary" style={{ marginTop: '24px', minHeight: '56px' }} onClick={checkAnswer}>정답 확인</button>
        </div>
      ) : (
        <div className={`card animate-fade-in ${isCorrect ? 'bg-correct' : 'bg-incorrect'}`}>
          <h2 className={isCorrect ? 'text-correct' : 'text-incorrect'} style={{ marginBottom: '16px', textAlign: 'center' }}>
            {isCorrect ? '정답입니다! 골든벨에 한 걸음 더 가까워졌어요! 🎉' : '괜찮아요. 지금 틀린 문제가 실전에서는 정답이 됩니다! 💪'}
          </h2>
          
          <div style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)' }}>정확한 정답: </span>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{q.correctAnswer}</span>
          </div>
          
          <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '16px', borderRadius: '8px', lineHeight: 1.6 }}>
            <strong>📖 해설:</strong><br/>
            {q.explanation}
          </div>

          <button className="btn-primary w-full" style={{ marginTop: '24px', minHeight: '56px' }} onClick={nextQuestion}>다음 문제</button>
        </div>
      )}
    </div>
  );
};

export default QuestionSolve;
