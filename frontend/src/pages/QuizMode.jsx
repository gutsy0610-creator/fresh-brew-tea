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
  const [subjectiveInput, setSubjectiveInput] = useState('');
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

  const isCorrect = (optionText) => {
    if (!currentQ.answer) return false;
    const ans = currentQ.answer.toString().trim();
    
    // Find index of the option
    const optIndex = currentQ.options.indexOf(optionText);
    
    if (optIndex !== -1) {
      const circles = ['①', '②', '③', '④', '⑤'];
      const arabics = ['1', '2', '3', '4', '5'];
      
      // If answer contains the exact circle number
      if (ans.includes(circles[optIndex])) return true;
      
      // If answer starts with the arabic number like "2", "2번", "2)"
      const numRegex = new RegExp(`^${arabics[optIndex]}(\\s|번|\\)|\\.|$)`);
      if (numRegex.test(ans)) return true;
    }

    // Fallback: check if the text matches (ignoring circle numbers if any were left)
    const cleanOpt = optionText.replace(/^[①②③④⑤]\s*/, '').trim();
    if (cleanOpt.length > 1 && ans.includes(cleanOpt)) return true;
    if (ans === cleanOpt) return true;

    return false;
  };

  const isCorrectSubjective = (input, answer) => {
    if (!answer) return false;
    const cleanInput = input.replace(/\s+/g, '').toLowerCase();
    const cleanAnswer = answer.toString().replace(/\s+/g, '').toLowerCase();
    
    if (cleanInput === '') return false;
    
    // Allow partial match for kids (e.g. they typed "영광" instead of "영광입니다")
    if (cleanAnswer.includes(cleanInput) || cleanInput.includes(cleanAnswer)) return true;
    return false;
  };

  const isCurrentCorrect = () => {
    return currentQ.options.length > 0 
      ? isCorrect(selectedAnswer) 
      : isCorrectSubjective(subjectiveInput, currentQ.answer);
  };

  const handleSelectOption = (option) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
  };

  const submitAnswer = () => {
    if (!selectedAnswer && currentQ.options.length > 0) return;
    if (currentQ.options.length === 0 && !subjectiveInput.trim()) {
      alert("정답을 입력해주세요!");
      return;
    }
    
    setIsAnswered(true);
    const correct = isCurrentCorrect();

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
    }
  };

  const goToNext = () => {
    if (mode === 'goldenbell' && !isCurrentCorrect()) {
      setGameOver(true);
      return;
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setSubjectiveInput('');
    } else {
      setGameOver(true);
    }
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
            <div style={{ padding: '20px', background: '#F8F9FA', borderRadius: '16px', border: '2px dashed #DFE6E9', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>주관식 문제입니다. 정답을 입력해주세요!</p>
              <input 
                type="text" 
                value={subjectiveInput}
                onChange={(e) => setSubjectiveInput(e.target.value)}
                disabled={isAnswered}
                placeholder="여기에 정답 입력..."
                style={{
                  width: '100%', maxWidth: '400px', padding: '15px', fontSize: '1.2rem',
                  borderRadius: '12px', border: '2px solid var(--primary-light)',
                  marginBottom: '15px', textAlign: 'center'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isAnswered) submitAnswer();
                }}
              />
              {isAnswered && (
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: isCurrentCorrect() ? 'var(--success-color)' : 'var(--warning-color)' }}>
                  {isCurrentCorrect() ? '정답입니다! 🎉' : '틀렸습니다!'} <br/>
                  <span style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>실제 정답: {currentQ.answer}</span>
                </div>
              )}
            </div>
          )}

          {/* Submit Button (Before Answered) */}
          {!isAnswered && (
            <div style={{ marginTop: '30px', textAlign: 'right' }}>
              <button 
                className={`btn ${(currentQ.options.length > 0 && selectedAnswer) || (currentQ.options.length === 0 && subjectiveInput.trim()) ? 'btn-primary' : 'btn-outline'}`}
                onClick={submitAnswer}
              >
                정답 제출
              </button>
            </div>
          )}
          
          {/* Next Button (After Answered) */}
          {isAnswered && (
             <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {currentQ.options && currentQ.options.length > 0 && (
                  <div style={{ padding: '15px', background: 'rgba(108, 92, 231, 0.05)', borderRadius: '12px' }}>
                    <strong style={{ color: 'var(--primary-dark)' }}>정답 설명:</strong> {currentQ.answer}
                  </div>
                )}
                
                <div style={{ textAlign: 'right' }}>
                  <button className="btn btn-primary" onClick={goToNext} autoFocus>
                    {(mode === 'goldenbell' && !isCurrentCorrect()) ? '결과 보기' : '다음 문제'}
                  </button>
                </div>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizMode;
