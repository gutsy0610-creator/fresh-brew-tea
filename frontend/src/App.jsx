import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, RefreshCcw, Settings, Star } from 'lucide-react';
import Home from './pages/Home';
import QuizMode from './pages/QuizMode';
import Flashcards from './pages/Flashcards';
import IncorrectNotes from './pages/IncorrectNotes';
import Admin from './pages/Admin';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Link to="/" className="logo-container">
            <div className="logo-icon pulse-gold">
              <Trophy size={24} />
            </div>
            <h1 className="golden-title">2026 성경골든벨 도전!</h1>
          </Link>
          <nav style={{ display: 'flex', gap: '15px' }}>
            <Link to="/admin" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              <Settings size={16} /> 관리자
            </Link>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz/:mode" element={<QuizMode />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/incorrect" element={<IncorrectNotes />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
