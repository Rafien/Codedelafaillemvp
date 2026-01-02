// Types pour le projet Code de la Faille

export type Category = 'draft' | 'macro' | 'items' | 'rôles' | 'phase';
export type Role = 'top' | 'jungle' | 'mid' | 'adc' | 'support' | 'général';
export type GamePhase = 'early' | 'mid' | 'late' | 'général';

export interface Answer {
  id: string;
  text: string;
  score: number; // 100 = bonne réponse, 0-99 = partiellement correct, 0 = mauvaise
}

export interface Question {
  id: string;
  context: string;
  question: string;
  answers: Answer[];
  explanation: string;
  category: Category;
  role: Role;
  gamePhase: GamePhase;
  createdAt: string;
}

export interface UserAnswer {
  questionId: string;
  answerId: string;
  score: number;
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  totalScore: number;
  answersHistory: UserAnswer[];
  createdAt: string;
}

export interface ProgressStats {
  totalQuestions: number;
  answeredQuestions: number;
  averageScore: number;
  scoreByCategory: Record<Category, number>;
  scoreByRole: Record<Role, number>;
  scoreByPhase: Record<GamePhase, number>;
}
