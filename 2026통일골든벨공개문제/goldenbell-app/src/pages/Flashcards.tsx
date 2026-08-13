import { useState, useMemo } from 'react';
import questionsData from '../data/questions.json';
import type { Question } from '../types';
import ExplanationText from '../components/ExplanationText';

const Flashcards: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState<string>('all'); // all, ch1, ch2...
  
  // Basic flashcard sorting based on "frequency" (stored locally)
  const [cardStats, setCardStats] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('goldenbell_flashcards');
    return saved ? JSON.parse(saved) : {};
  });

  const saveCardStats = (newStats: Record<number, number>) => {
    setCardStats(newStats);
    localStorage.setItem('goldenbell_flashcards', JSON.stringify(newStats));
  };

  const filteredQuestions = useMemo(() => {
    let list = questionsData as Question[];
    if (mode.startsWith('ch')) {
      const ch = parseInt(mode.replace('ch', ''), 10);
      list = list.filter(q => q.chapter === ch);
    } else if (mode === 'confused') {
      list = list.filter(q => (cardStats[q.id] || 0) > 0);
    }
    
    // Sort by weight: higher weight = appears more often/earlier
    return [...list].sort((a, b) => {
      const weightA = cardStats[a.id] || 0;
      const weightB = cardStats[b.id] || 0;
      // random mix with weight
      return (weightB + Math.random()) - (weightA + Math.random());
    });
  }, [mode, cardStats]);

  const handleNext = (weightIncrement: number) => {
    const q = filteredQuestions[currentIndex];
    const newStats = { ...cardStats };
    
    // update weight
    const currentWeight = newStats[q.id] || 0;
    const newWeight = Math.max(0, currentWeight + weightIncrement);
    if (newWeight > 0) newStats[q.id] = newWeight;
    else delete newStats[q.id];
    
    saveCardStats(newStats);
    
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex + 1 < filteredQuestions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Loop back
        setCurrentIndex(0);
      }
    }, 150);
  };

  if (filteredQuestions.length === 0) {
    return (
      <div className="page-container flex-center flex-column gap-md">
        <h2>학습할 카드가 없습니다.</h2>
        <button className="btn-primary" onClick={() => setMode('all')}>전체 보기로 변경</button>
      </div>
    );
  }

  const currentQ = filteredQuestions[currentIndex];

  return (
    <div className="page-container animate-fade-in flex-column gap-md">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>핵심 암기</h2>
        <select value={mode} onChange={(e) => { setMode(e.target.value); setCurrentIndex(0); setIsFlipped(false); }} style={{ padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <option value="all">전체 암기</option>
          <option value="ch1">1단원</option>
          <option value="ch2">2단원</option>
          <option value="ch3">3단원</option>
          <option value="ch4">4단원</option>
          <option value="confused">헷갈리는 카드만</option>
        </select>
      </div>

      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        {currentIndex + 1} / {filteredQuestions.length}
      </div>

      <div 
        className="flashcard-container" 
        style={{ perspective: '1000px', height: '400px', cursor: 'pointer' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className="flashcard-inner" 
          style={{ 
            width: '100%', 
            height: '100%', 
            transition: 'transform 0.6s', 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            position: 'relative'
          }}
        >
          {/* Front */}
          <div className="card flex-center flex-column" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', backgroundColor: 'var(--main-blue)', color: 'white' }}>
            <div style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '12px', opacity: 0.8 }}>공개문제 {currentQ.originalNumber}번</div>
            <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '12px', opacity: 0.8 }}>{currentQ.chapterTitle}</div>
            <h3 style={{ fontSize: '20px', color: 'white', marginTop: '20px', lineHeight: 1.5, marginBottom: currentQ.originalType === '객관식' ? '12px' : '0' }}>{currentQ.question}</h3>
            {currentQ.originalType === '객관식' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '90%', marginTop: '12px', fontSize: '14px', textAlign: 'left', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '12px', borderRadius: '8px' }}>
                {currentQ.choices.map((choice, idx) => (
                  <div key={idx}>
                    {idx + 1}. {choice}
                  </div>
                ))}
              </div>
            )}
            <div style={{ position: 'absolute', bottom: '20px', fontSize: '14px', opacity: 0.8 }}>터치해서 뒤집기 👆</div>
          </div>

          {/* Back */}
          <div className="card flex-column" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflowY: 'auto' }}>
            <h2 style={{ color: 'var(--correct-green)', textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>{currentQ.correctAnswer}</h2>
            <div style={{ fontSize: '14px', flex: 1 }}>
              <strong>📖 해설:</strong>
              <ExplanationText text={currentQ.explanation} keywords={[...currentQ.keywords, currentQ.correctAnswer]} />
            </div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '16px' }}>
          <button className="btn-outline" style={{ borderColor: 'var(--correct-green)', color: 'var(--correct-green)', fontSize: '14px', padding: '8px' }} onClick={() => handleNext(-1)}>
            잘 알아요 😊
          </button>
          <button className="btn-outline" style={{ borderColor: 'var(--point-yellow-dark)', color: 'var(--point-yellow-dark)', fontSize: '14px', padding: '8px' }} onClick={() => handleNext(1)}>
            헷갈려요 🤔
          </button>
          <button className="btn-outline" style={{ borderColor: 'var(--incorrect-coral)', color: 'var(--incorrect-coral)', fontSize: '14px', padding: '8px' }} onClick={() => handleNext(2)}>
            다시 외울래요 😭
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
