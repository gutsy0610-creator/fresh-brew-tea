import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import derivedData from '../data/derived_questions.json';
import { DerivedQuestion } from '../types';
import { useLearningData } from '../hooks/useLearningData';
import { isCorrectSubjective, shuffleArray } from '../utils/scoring';

const DerivedSolve: React.FC = () => {
  const navigate = useNavigate();
  const { recordResult } = useLearningData();

  const [setupMode, setSetupMode] = useState(true);
  const [quizQueue, setQuizQueue] = useState<DerivedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleStart = () => {
    let list = [...(derivedData as DerivedQuestion[])];
    if (list.length === 0) {
      alert('등록된 응용문제가 없습니다.');
      return;
    }

    list = shuffleArray(list).slice(0, 20); // Limit to 20 for derived
    setQuizQueue(list);
    setCurrentIndex(0);
    setSetupMode(false);
    prepareQuestion(list[0]);
  };

  const prepareQuestion = (q: DerivedQuestion) => {
    setUserAnswer('');
    setShowResult(false);
    if (q.choices && q.choices.length > 0) {
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
    
    if (q.questionType === 'OX 판단' || (q.choices && q.choices.length > 0)) {
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
      alert('모든 응용문제를 풀었습니다!');
      setSetupMode(true);
    }
  };

  if (setupMode) {
    return (
      <div className="page-container animate-fade-in flex-column gap-md">
        <h2>💡 해설 응용문제</h2>
        <div className="card">
          <p>공개문제 해설에서 추출한 새로운 사실 기반의 응용문제를 풀어보세요.</p>
          <p>총 {derivedData.length}개의 응용문제가 준비되어 있습니다.</p>
          <button className="btn-accent w-full" onClick={handleStart}>랜덤 20문제 풀기 시작</button>
        </div>
      </div>
    );
  }

  const q = quizQueue[currentIndex];

  return (
    <div className="page-container animate-fade-in flex-column gap-md" style={{ paddingBottom: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
        <span>응용: {q.questionType}</span>
        <span>{currentIndex + 1} / {quizQueue.length}</span>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '20px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{q.question}</h3>
      </div>

      {!showResult ? (
        <div className="flex-column gap-sm">
          {q.choices && q.choices.length > 0 && currentChoices.map((choice, i) => (
            <button 
              key={i} 
              className={userAnswer === choice ? 'btn-primary' : 'btn-outline'}
              style={{ justifyContent: 'flex-start', textAlign: 'left', minHeight: '56px' }}
              onClick={() => setUserAnswer(choice)}
            >
              {choice}
            </button>
          ))}
          {q.questionType === 'OX 판단' && (
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className={userAnswer === 'O' ? 'btn-primary' : 'btn-outline'} style={{ flex: 1, height: '100px', fontSize: '48px' }} onClick={() => setUserAnswer('O')}>O</button>
              <button className={userAnswer === 'X' ? 'btn-primary' : 'btn-outline'} style={{ flex: 1, height: '100px', fontSize: '48px' }} onClick={() => setUserAnswer('X')}>X</button>
            </div>
          )}
          {(!q.choices || q.choices.length === 0) && q.questionType !== 'OX 판단' && (
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
            {isCorrect ? '정답입니다! 👏' : '아쉽네요. 🥲'}
          </h2>
          
          <div style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)' }}>정확한 정답: </span>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{q.correctAnswer}</span>
          </div>
          
          <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '16px', borderRadius: '8px', lineHeight: 1.6 }}>
            <strong>📖 상세 해설:</strong><br/>
            {q.explanation}
            
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>근거 원본 문제: {q.sourceOriginalNumber}번</div>
              <div style={{ fontSize: '14px', fontStyle: 'italic', marginTop: '4px' }}>"{q.evidenceFromSourceExplanation}"</div>
            </div>
          </div>

          <button className="btn-primary w-full" style={{ marginTop: '24px', minHeight: '56px' }} onClick={nextQuestion}>다음 문제</button>
        </div>
      )}
    </div>
  );
};

export default DerivedSolve;
