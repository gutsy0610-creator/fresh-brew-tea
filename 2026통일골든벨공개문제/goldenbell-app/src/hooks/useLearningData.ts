import { useState, useEffect } from 'react';
import type { IncorrectRecord, LearningStats, Question, DerivedQuestion } from '../types';

const STATS_KEY = 'goldenbell_stats';
const INCORRECT_KEY = 'goldenbell_incorrect';
const PROGRESS_KEY = 'goldenbell_progress';

const initialStats: LearningStats = {
  totalSolved: 0,
  totalCorrect: 0,
  chapterStats: {},
  typeStats: {},
  derivedStats: { solved: 0, correct: 0 },
  todaySolved: 0,
  lastStudyDate: '',
  consecutiveDays: 0,
  goldenBellHighScore: 0,
};

export const useLearningData = () => {
  const [stats, setStats] = useState<LearningStats>(initialStats);
  const [incorrectRecords, setIncorrectRecords] = useState<IncorrectRecord[]>([]);
  const [progress, setProgress] = useState<number[]>([]); // Array of solved question originalNumbers

  useEffect(() => {
    const loadedStats = localStorage.getItem(STATS_KEY);
    const loadedIncorrect = localStorage.getItem(INCORRECT_KEY);
    const loadedProgress = localStorage.getItem(PROGRESS_KEY);

    if (loadedStats) setStats(JSON.parse(loadedStats));
    if (loadedIncorrect) setIncorrectRecords(JSON.parse(loadedIncorrect));
    if (loadedProgress) setProgress(JSON.parse(loadedProgress));
  }, []);

  const saveStats = (newStats: LearningStats) => {
    setStats(newStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  };

  const saveIncorrect = (newRecords: IncorrectRecord[]) => {
    setIncorrectRecords(newRecords);
    localStorage.setItem(INCORRECT_KEY, JSON.stringify(newRecords));
  };

  const saveProgress = (newProgress: number[]) => {
    setProgress(newProgress);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
  };

  const recordResult = (
    q: Question | DerivedQuestion,
    isCorrect: boolean,
    userAnswer: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const newStats = { ...stats };
    
    // Update daily stats
    if (newStats.lastStudyDate !== today) {
      if (
        newStats.lastStudyDate ===
        new Date(Date.now() - 86400000).toISOString().split('T')[0]
      ) {
        newStats.consecutiveDays += 1;
      } else {
        newStats.consecutiveDays = 1;
      }
      newStats.lastStudyDate = today;
      newStats.todaySolved = 0;
    }
    
    newStats.todaySolved += 1;
    newStats.totalSolved += 1;
    if (isCorrect) newStats.totalCorrect += 1;

    const isDerived = 'derivedId' in q;

    if (isDerived) {
      newStats.derivedStats.solved += 1;
      if (isCorrect) newStats.derivedStats.correct += 1;
    } else {
      const origQ = q as Question;
      if (!newStats.chapterStats[origQ.chapter]) {
        newStats.chapterStats[origQ.chapter] = { solved: 0, correct: 0 };
      }
      newStats.chapterStats[origQ.chapter].solved += 1;
      if (isCorrect) newStats.chapterStats[origQ.chapter].correct += 1;

      if (!newStats.typeStats[origQ.originalType]) {
        newStats.typeStats[origQ.originalType] = { solved: 0, correct: 0 };
      }
      newStats.typeStats[origQ.originalType].solved += 1;
      if (isCorrect) newStats.typeStats[origQ.originalType].correct += 1;

      // Update progress
      if (!progress.includes(origQ.originalNumber)) {
        saveProgress([...progress, origQ.originalNumber]);
      }
    }

    saveStats(newStats);

    // Update Incorrect Records
    if (!isDerived) {
      const origQ = q as Question;
      let newRecords = [...incorrectRecords];
      const existingIdx = newRecords.findIndex(
        (r) => r.originalNumber === origQ.originalNumber
      );

      if (!isCorrect) {
        if (existingIdx >= 0) {
          newRecords[existingIdx].incorrectCount += 1;
          newRecords[existingIdx].lastIncorrectDate = today;
          newRecords[existingIdx].consecutiveCorrectCount = 0;
          newRecords[existingIdx].userAnswer = userAnswer;
        } else {
          newRecords.push({
            originalNumber: origQ.originalNumber,
            chapter: origQ.chapter,
            originalType: origQ.originalType,
            question: origQ.question,
            userAnswer,
            correctAnswer: origQ.correctAnswer,
            explanation: origQ.explanation,
            incorrectCount: 1,
            lastIncorrectDate: today,
            isReviewed: false,
            consecutiveCorrectCount: 0,
          });
        }
      } else {
        if (existingIdx >= 0 && !newRecords[existingIdx].isReviewed) {
          newRecords[existingIdx].consecutiveCorrectCount += 1;
          if (newRecords[existingIdx].consecutiveCorrectCount >= 2) {
            newRecords[existingIdx].isReviewed = true;
          }
        }
      }
      saveIncorrect(newRecords);
    }
  };

  const updateHighScore = (score: number) => {
    if (score > stats.goldenBellHighScore) {
      saveStats({ ...stats, goldenBellHighScore: score });
    }
  };

  const resetAll = () => {
    saveStats(initialStats);
    saveIncorrect([]);
    saveProgress([]);
  };

  return {
    stats,
    incorrectRecords,
    progress,
    recordResult,
    updateHighScore,
    resetAll,
    saveStats,
    saveIncorrect,
  };
};
