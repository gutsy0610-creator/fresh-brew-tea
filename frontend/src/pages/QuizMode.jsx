import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import questionsDataRaw from '../data/questions.json';

const QuizMode = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [incorrectList, setIncorrectList] = useState([]);

  // Setup game
  useEffect(() => {
    const validQuestions = questionsDataRaw.filter(q => q.answer && q.answer.trim() !== '');
    const shuffled = [...validQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
  }, [mode]);

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQ = questions[currentIndex];

  // Helper to determine if an option matches the answer
  const isCorrect = (optionText) => {
    if (!currentQ.answer) return false;
    // For objective questions
    if (optionText.includes(currentQ.answer) || currentQ.answer.includes(optionText.trim()[0])) {
      return true;
    }
    // For simple text answers, we'd need better matching but this is a start
    return false;
  };

  const handleSelectOption = (option) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
  };

  const submitAnswer = () => {
    if (!selectedAnswer && currentQ.options.length > 0) return;
    
    setIsAnswered(true);
    
    let correct = false;
    if (currentQ.options.length > 0) {
      correct = isCorrect(selectedAnswer);
    } else {
      // Subjective self-check or exact string match - simplified for demo
      correct = true; // Assume correct for subjective in this demo unless they say no
    }

    if (correct) {
      setScore(score + 1);
      if (mode === 'goldenbell') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#FDCB6E', '#6C5CE7', '#00CEC9']
        });
      }
    } else {
      // Save to local storage for incorrect notes
      const saved = JSON.parse(localStorage.getItem('incorrectNotes') || '[]');
      if (!saved.find(q => q.id === currentQ.id)) {
        saved.push(currentQ);
        localStorage.setItem('incorrectNotes', JSON.stringify(saved));
      }

      if (mode === 'goldenbell') {
        // Golden bell ends on first mistake
        setTimeout(() => {
          setGameOver(true);
        }, 1500);
        return;
      }
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        setGameOver(true);
      }
    }, 2000);
  };

  const getOptionClass = (option) => {
    if (!isAnswered) return selectedAnswer === option ? 'selected' : '';
    
    if (isCorrect(option)) return 'correct';
    if (selectedAnswer === option && !isCorrect(option)) return 'incorrect';
    return '';
  };

  if (gameOver) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        {mode === 'goldenbell' && score > 0 ? (
          <>
            <h2 className="golden-title" style={{ fontSize: '3rem', marginBottom: '20px' }}>도전 종료!</h2>
            <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>무려 <strong>{score}</strong>문제를 맞혔어요!</p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--primary-dark)' }}>수고했어요!</h2>
            <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>총 <strong>{score}</strong>문제를 맞혔습니다.</p>
          </>
        )}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => navigate('/')}>홈으로 가기</button>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>다시 도전</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> 나가기
        </button>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
          {mode === 'goldenbell' ? '골든벨 모드' : '기본 모드'} | {currentIndex + 1} / {questions.length}
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--gold-color)' }}>
          점수: {score}
        </div>
      </div>

      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="question-card"
        >
          <div style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>
            출처: {currentQ.source.replace('.txt', '')}
          </div>
          <h2 className="question-text">{currentQ.question}</h2>

          {currentQ.options && currentQ.options.length > 0 ? (
            <div className="options-grid">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`option-btn ${getOptionClass(opt)}`}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                >
                  <div className="option-index">{idx + 1}</div>
                  <div style={{ flex: 1 }}>{opt.replace(/^[①②③④⑤]/, '')}</div>
                  
                  {isAnswered && isCorrect(opt) && <CheckCircle2 color="var(--success-color)" />}
                  {isAnswered && selectedAnswer === opt && !isCorrect(opt) && <XCircle color="var(--warning-color)" />}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px', background: '#F8F9FA', borderRadius: '16px', border: '2px dashed #DFE6E9' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>주관식 문제입니다. 정답을 마음속으로 생각해보세요!</p>
              {isAnswered ? (
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                  정답: {currentQ.answer}
                </div>
              ) : (
                <button className="btn btn-primary" onClick={() => setIsAnswered(true)}>정답 확인하기</button>
              )}
            </div>
          )}

          {currentQ.options && currentQ.options.length > 0 && !isAnswered && (
            <div style={{ marginTop: '30px', textAlign: 'right' }}>
              <button 
                className={`btn ${selectedAnswer ? 'btn-primary' : 'btn-outline'}`}
                onClick={submitAnswer}
                disabled={!selectedAnswer}
              >
                정답 제출
              </button>
            </div>
          )}
          
          {isAnswered && currentQ.options && currentQ.options.length > 0 && (
             <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(108, 92, 231, 0.05)', borderRadius: '12px' }}>
                <strong style={{ color: 'var(--primary-dark)' }}>정답 설명:</strong> {currentQ.answer}
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizMode;
