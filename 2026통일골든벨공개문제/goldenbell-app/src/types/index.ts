export interface Question {
  id: number;
  originalNumber: number;
  chapter: number;
  chapterTitle: string;
  originalType: '객관식' | '주관식' | 'OX';
  question: string;
  choices: string[];
  correctAnswer: string;
  acceptedAnswers: string[];
  explanation: string;
  keywords: string[];
  needsReview: boolean;
}

export interface DerivedQuestion {
  derivedId: number;
  sourceOriginalNumber: number;
  questionType: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  acceptedAnswers: string[];
  explanation: string;
  evidenceFromSourceExplanation: string;
  difficulty: string;
}

export interface IncorrectRecord {
  originalNumber: number;
  chapter: number;
  originalType: '객관식' | '주관식' | 'OX';
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  incorrectCount: number;
  lastIncorrectDate: string;
  isReviewed: boolean;
  consecutiveCorrectCount: number;
}

export interface LearningStats {
  totalSolved: number;
  totalCorrect: number;
  chapterStats: Record<number, { solved: number, correct: number }>;
  typeStats: Record<string, { solved: number, correct: number }>;
  derivedStats: { solved: number, correct: number };
  todaySolved: number;
  lastStudyDate: string;
  consecutiveDays: number;
  goldenBellHighScore: number;
}
