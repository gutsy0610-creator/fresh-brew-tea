import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';

const IncorrectNotes = () => {
  const navigate = useNavigate();
  const [incorrectList, setIncorrectList] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('incorrectNotes') || '[]');
    setIncorrectList(saved);
  }, []);

  const clearNotes = () => {
    if (window.confirm('오답 노트를 모두 지우시겠습니까?')) {
      localStorage.removeItem('incorrectNotes');
      setIncorrectList([]);
    }
  };

  const removeNote = (id) => {
    const updated = incorrectList.filter(q => q.id !== id);
    localStorage.setItem('incorrectNotes', JSON.stringify(updated));
    setIncorrectList(updated);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> 나가기
        </button>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
          나만의 오답 노트
        </div>
        <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', color: 'var(--warning-color)', borderColor: 'var(--warning-color)' }} onClick={clearNotes}>
          <Trash2 size={16} /> 모두 지우기
        </button>
      </div>

      {incorrectList.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>아직 틀린 문제가 없어요!</h2>
          <p>퀴즈를 풀고 틀린 문제들을 여기서 모아보세요.</p>
          <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/quiz/normal')}>
            <Repeat size={18} /> 퀴즈 풀러 가기
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {incorrectList.map((q, idx) => (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="question-card"
              style={{ padding: '25px', marginBottom: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '10px' }}>
                  오답 #{idx + 1}
                </div>
                <button onClick={() => removeNote(q.id)} style={{ color: 'var(--text-light)' }}>
                  <Trash2 size={18} />
                </button>
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>{q.question}</h3>
              
              <div style={{ background: 'rgba(85, 230, 193, 0.1)', padding: '15px', borderRadius: '12px', border: '1px dashed var(--success-color)' }}>
                <span style={{ fontWeight: 'bold', color: '#009432', marginRight: '10px' }}>정답:</span>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{q.answer || '(정답 없음)'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncorrectNotes;
