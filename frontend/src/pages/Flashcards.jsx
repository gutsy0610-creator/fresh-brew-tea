import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import questionsDataRaw from '../data/questions.json';

const Flashcards = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const questions = questionsDataRaw;

  const currentQ = questions[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % questions.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
    }, 150);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> 나가기
        </button>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
          플래시카드 학습
        </div>
        <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div style={{ perspective: '1000px', margin: '40px 0', height: '400px' }}>
        <motion.div
          onClick={() => setIsFlipped(!isFlipped)}
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            cursor: 'pointer'
          }}
        >
          {/* Front (Question) */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)',
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            boxShadow: '0 15px 35px rgba(108, 92, 231, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
              문제 {currentIndex + 1}
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.5', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {currentQ.question}
            </h2>
            <div style={{ position: 'absolute', bottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8, fontSize: '0.9rem' }}>
              <RotateCw size={16} /> 탭하여 정답 보기
            </div>
          </div>

          {/* Back (Answer) */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--text-main)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
            transform: 'rotateY(180deg)',
            textAlign: 'center',
            border: '2px solid var(--primary-light)'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '20px' }}>정답</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary-dark)' }}>
              {currentQ.answer || '(정답 없음)'}
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button className="btn btn-outline" onClick={handlePrev} style={{ borderRadius: '50%', width: '60px', height: '60px', padding: 0 }}>
          <ChevronLeft size={24} />
        </button>
        <button className="btn btn-primary" onClick={handleNext} style={{ borderRadius: '50%', width: '60px', height: '60px', padding: 0, boxShadow: '0 10px 20px rgba(108, 92, 231, 0.4)' }}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
