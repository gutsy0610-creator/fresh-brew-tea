import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questionsData from '../data/questions.json';
import derivedData from '../data/derived_questions.json';
import { Question, DerivedQuestion } from '../types';
import { useLearningData } from '../hooks/useLearningData';
import { isCorrectSubjective, shuffleArray } from '../utils/scoring';

type QuizItem = Question | DerivedQuestion;

const GoldenBell: React.FC = () => {
  const navigate = useNavigate();
  const { updateHighScore } = useLearningData();

  const [setupMode, setSetupMode] = useState(true);
  const [gameMode, setGameMode] = useState('practice'); // practice, real, family
  const [qCount, setQCount] = useState(10);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Family mode
  const [players, setPlayers] = useState<string[]>(['참가자1', '참가자2']);

  const [quizQueue, setQuizQueue] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const [score, setScore] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  const handleStart = () => {
    // Mix questions and derived questions
    let allQs: QuizItem[] = [...questionsData as Question[], ...derivedData as DerivedQuestion[]];
    allQs = shuffleArray(allQs);
    
    if (qCount !== 200) {
      allQs = allQs.slice(0, qCount);
    }
    
    setQuizQueue(allQs);
    setCurrentIndex(0);
    setScore(0);
    setConsecutiveCorrect(0);
    setGameOver(false);
    setSetupMode(false);
    prepareQuestion(allQs[0]);
  };

  const prepareQuestion = (q: QuizItem) => {
    setUserAnswer('');
    setShowResult(false);
    
    // Type guard for choices
    let choices: string[] = [];
    if ('originalType' in q) {
      if (q.originalType === '객관식') choices = q.choices;
    } else {
      if (q.choices && q.choices.length > 0) choices = q.choices;
    }
    
    if (choices.length > 0) {
      setCurrentChoices(shuffleArray(choices));
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
    
    const type = 'originalType' in q ? q.originalType : q.questionType;
    
    if (type === '객관식' || type === 'OX 판단' || type === 'OX' || ('choices' in q && q.choices?.length! > 0)) {
      correct = (userAnswer === q.correctAnswer);
    } else {
      correct = isCorrectSubjective(userAnswer, q.acceptedAnswers);
    }

    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(s => s + 1);
      setConsecutiveCorrect(c => c + 1);
    } else {
      setConsecutiveCorrect(0);
      if (gameMode === 'real') {
        setGameOver(true);
        updateHighScore(score);
      }
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < quizQueue.length) {
      setCurrentIndex(currentIndex + 1);
      prepareQuestion(quizQueue[currentIndex + 1]);
    } else {
      setGameOver(true);
      updateHighScore(score + (isCorrect ? 1 : 0));
    }
  };

  if (setupMode) {
    return (
      <div className="page-container animate-fade-in flex-column gap-md">
        <h2>🔔 실전 골든벨</h2>
        
        <div className="card flex-column gap-md">
          <label>게임 모드</label>
          <select value={gameMode} onChange={e => setGameMode(e.target.value)} style={{ padding: '12px' }}>
            <option value="practice">연습 모드 (틀려도 계속 진행)</option>
            <option value="real">실전 모드 (한 문제 틀리면 종료)</option>
            <option value="family">가족 대결 모드</option>
          </select>

          {gameMode === 'family' && (
            <div className="flex-column gap-sm" style={{ padding: '12px', backgroundColor: 'var(--surface-color-hover)', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>가족 대결 모드는 번갈아가며 문제를 푸는 방식입니다.</p>
            </div>
          )}

          <label>문제 수</label>
          <select value={qCount} onChange={e => setQCount(Number(e.target.value))} style={{ padding: '12px' }}>
            <option value={10}>10문제</option>
            <option value={20}>20문제</option>
            <option value={30}>30문제</option>
            <option value={50}>50문제</option>
            <option value={200}>전체 200문제</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <input 
              type="checkbox" 
              id="sound" 
              checked={soundEnabled} 
              onChange={e => setSoundEnabled(e.target.checked)} 
              style={{ width: '20px', height: '20px' }}
            />
            <label htmlFor="sound">효과음 켜기</label>
          </div>

          <button className="btn-accent" style={{ marginTop: '16px', minHeight: '56px', fontSize: '18px' }} onClick={handleStart}>골든벨 시작하기!</button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="page-container animate-fade-in flex-center flex-column gap-lg">
        <h1 style={{ fontSize: '64px', margin: 0 }}>{isCorrect && currentIndex + 1 === quizQueue.length ? '🎊' : '💥'}</h1>
        <h2>도전 종료!</h2>
        <div className="card text-center w-full">
          <div style={{ fontSize: '18px', color: 'var(--text-muted)' }}>최종 점수</div>
          <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--main-dark)', margin: '16px 0' }}>{score}점</div>
          <div style={{ fontSize: '16px' }}>총 {currentIndex + 1}문제 중 {score}문제를 맞혔습니다.</div>
        </div>
        <button className="btn-primary w-full" onClick={() => setSetupMode(true)}>다시 도전하기</button>
        <button className="btn-outline w-full" onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    );
  }

  const q = quizQueue[currentIndex];
  const qType = 'originalType' in q ? q.originalType : q.questionType;
  const isDerived = 'derivedId' in q;
  const originalNum = isDerived ? q.sourceOriginalNumber : q.originalNumber;

  // Intermediate result
  if (currentIndex > 0 && currentIndex % 10 === 0 && !showResult && userAnswer === '') {
    return (
      <div className="page-container animate-fade-in flex-center flex-column gap-md">
        <h2>중간 점검 📊</h2>
        <div className="card text-center w-full">
          <p>현재까지 <strong>{score}문제</strong>를 맞혔습니다!</p>
          <p>연속 정답: {consecutiveCorrect}문제</p>
          <p>남은 문제: {quizQueue.length - currentIndex}문제</p>
        </div>
        <button className="btn-accent w-full" onClick={() => setUserAnswer('continue')}>다음 문제로 🚀</button>
      </div>
    );
  }

  // Clear dummy answer used for intermediate screen
  if (userAnswer === 'continue') {
     setUserAnswer('');
  }

  let currentPlayer = '';
  if (gameMode === 'family') {
    currentPlayer = players[currentIndex % players.length];
  }

  return (
    <div className="page-container animate-fade-in flex-column gap-md" style={{ paddingBottom: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ backgroundColor: 'var(--point-yellow)', padding: '4px 12px', borderRadius: '16px', fontWeight: 600 }}>현재 점수: {score}점</span>
        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{currentIndex + 1} / {quizQueue.length}</span>
      </div>

      <div className="card text-center" style={{ backgroundColor: 'var(--main-dark)', color: 'white', padding: '32px 16px' }}>
        {gameMode === 'family' && <div style={{ color: 'var(--point-yellow)', marginBottom: '8px' }}>🗣️ {currentPlayer} 차례입니다</div>}
        <h2 style={{ color: 'var(--point-yellow)', fontSize: '28px', marginBottom: '16px' }}>도전 {currentIndex + 1}번 문제</h2>
        <h3 style={{ fontSize: '22px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{q.question}</h3>
      </div>

      {!showResult ? (
        <div className="flex-column gap-sm">
          {currentChoices.length > 0 && currentChoices.map((choice, i) => (
            <button 
              key={i} 
              className={userAnswer === choice ? 'btn-primary' : 'btn-outline'}
              style={{ justifyContent: 'flex-start', textAlign: 'left', minHeight: '56px' }}
              onClick={() => setUserAnswer(choice)}
            >
              {i + 1}. {choice}
            </button>
          ))}
          {(qType === 'OX' || qType === 'OX 판단') && (
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className={userAnswer === 'O' ? 'btn-primary' : 'btn-outline'} style={{ flex: 1, height: '100px', fontSize: '48px' }} onClick={() => setUserAnswer('O')}>O</button>
              <button className={userAnswer === 'X' ? 'btn-primary' : 'btn-outline'} style={{ flex: 1, height: '100px', fontSize: '48px' }} onClick={() => setUserAnswer('X')}>X</button>
            </div>
          )}
          {currentChoices.length === 0 && qType !== 'OX' && qType !== 'OX 판단' && (
            <input 
              type="text" 
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              placeholder="정답을 입력하세요"
              style={{ padding: '16px', fontSize: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', width: '100%' }}
            />
          )}

          <button className="btn-accent" style={{ marginTop: '24px', minHeight: '56px', fontSize: '18px' }} onClick={checkAnswer}>정답 확인</button>
        </div>
      ) : (
        <div className={`card animate-fade-in ${isCorrect ? 'bg-correct' : 'bg-incorrect'}`}>
          <h2 className={isCorrect ? 'text-correct' : 'text-incorrect'} style={{ marginBottom: '16px', textAlign: 'center', fontSize: '28px' }}>
            {isCorrect ? '정답!! 🔔' : '오답 💦'}
          </h2>
          
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>정답: </span>
            <span style={{ fontWeight: 'bold', fontSize: '24px' }}>{q.correctAnswer}</span>
          </div>
          
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '16px' }}>
            이 문제는 공개문제 원본 {originalNum}번을 바탕으로 출제되었습니다.
          </div>

          <button className="btn-primary w-full" style={{ marginTop: '16px', minHeight: '56px' }} onClick={nextQuestion}>다음 진행</button>
        </div>
      )}
    </div>
  );
};

export default GoldenBell;
