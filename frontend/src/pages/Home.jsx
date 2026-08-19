import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Gamepad2, Brain, History } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-panel" style={{ textAlign: 'center' }}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--primary-dark)' }}>
          말씀을 배우고, 문제를 풀고, 골든벨에 도전해요!
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          초등학교 3~6학년 친구들을 위한 재미있는 성경 골든벨 학습 놀이터입니다.
        </p>
      </motion.div>

      <div className="features-grid">
        <motion.div
          className="feature-card"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/flashcards')}
        >
          <div className="feature-icon-wrapper bg-blue floating">
            <BookOpen size={36} />
          </div>
          <h3>말씀 플래시카드</h3>
          <p>카드를 넘기며 재미있게 성경 문제를 외워보세요!</p>
          <button className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }}>학습 시작</button>
        </motion.div>

        <motion.div
          className="feature-card"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/quiz/normal')}
        >
          <div className="feature-icon-wrapper bg-green floating" style={{ animationDelay: '0.2s' }}>
            <Gamepad2 size={36} />
          </div>
          <h3>기본 문제 풀기</h3>
          <p>객관식과 주관식 문제를 풀며 실력을 확인하세요.</p>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>풀기 시작</button>
        </motion.div>

        <motion.div
          className="feature-card"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/quiz/goldenbell')}
          style={{ borderColor: 'var(--gold-color)', borderWidth: '2px', borderStyle: 'dashed' }}
        >
          <div className="feature-icon-wrapper bg-gold pulse-gold">
            <Brain size={36} />
          </div>
          <h3 className="golden-title">실전! 골든벨 모드</h3>
          <p>틀리면 탈락! 끝까지 살아남아 골든벨을 울려보세요!</p>
          <button className="btn btn-golden" style={{ width: '100%', marginTop: 'auto' }}>도전하기</button>
        </motion.div>

        <motion.div
          className="feature-card"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/incorrect')}
        >
          <div className="feature-icon-wrapper bg-pink floating" style={{ animationDelay: '0.4s' }}>
            <History size={36} />
          </div>
          <h3>오답 노트</h3>
          <p>내가 틀렸던 문제만 다시 모아서 완벽하게 복습해요.</p>
          <button className="btn btn-outline" style={{ width: '100%', marginTop: 'auto', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>복습하기</button>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
