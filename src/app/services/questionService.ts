import { Question, UserAnswer, User, ProgressStats, Category, Role, GamePhase } from '../types';
import { mockQuestions } from '../data/mockQuestions';
import { authService } from './auth';

const QUESTIONS_KEY = 'code_faille_questions';

export const questionService = {
  // Initialiser les questions
  initQuestions: (): void => {
    const questions = localStorage.getItem(QUESTIONS_KEY);
    if (!questions) {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(mockQuestions));
    }
  },

  // Récupérer toutes les questions
  getAllQuestions: (): Question[] => {
    questionService.initQuestions();
    const questionsStr = localStorage.getItem(QUESTIONS_KEY);
    return questionsStr ? JSON.parse(questionsStr) : [];
  },

  // Récupérer une question par ID
  getQuestionById: (id: string): Question | null => {
    const questions = questionService.getAllQuestions();
    return questions.find(q => q.id === id) || null;
  },

  // Filtrer les questions
  filterQuestions: (filters: {
    category?: Category;
    role?: Role;
    gamePhase?: GamePhase;
  }): Question[] => {
    let questions = questionService.getAllQuestions();

    if (filters.category && filters.category !== 'général') {
      questions = questions.filter(q => q.category === filters.category);
    }
    if (filters.role && filters.role !== 'général') {
      questions = questions.filter(q => q.role === filters.role);
    }
    if (filters.gamePhase && filters.gamePhase !== 'général') {
      questions = questions.filter(q => q.gamePhase === filters.gamePhase);
    }

    return questions;
  },

  // Ajouter/modifier une question (admin uniquement)
  saveQuestion: (question: Question): boolean => {
    if (!authService.isAdmin()) return false;

    const questions = questionService.getAllQuestions();
    const index = questions.findIndex(q => q.id === question.id);

    if (index !== -1) {
      questions[index] = question;
    } else {
      questions.push(question);
    }

    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
    return true;
  },

  // Supprimer une question (admin uniquement)
  deleteQuestion: (id: string): boolean => {
    if (!authService.isAdmin()) return false;

    const questions = questionService.getAllQuestions();
    const filtered = questions.filter(q => q.id !== id);
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(filtered));
    return true;
  },

  // Enregistrer une réponse utilisateur
  submitAnswer: (questionId: string, answerId: string): number => {
    const question = questionService.getQuestionById(questionId);
    const user = authService.getCurrentUser();

    if (!question || !user) return 0;

    const answer = question.answers.find(a => a.id === answerId);
    if (!answer) return 0;

    const userAnswer: UserAnswer = {
      questionId,
      answerId,
      score: answer.score,
      timestamp: new Date().toISOString()
    };

    // Mettre à jour l'historique de l'utilisateur
    user.answersHistory.push(userAnswer);
    user.totalScore = questionService.calculateTotalScore(user.answersHistory);
    authService.updateUser(user);

    return answer.score;
  },

  // Calculer le score total
  calculateTotalScore: (history: UserAnswer[]): number => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, ans) => acc + ans.score, 0);
    return Math.round(sum / history.length);
  },

  // Vérifier si une question a été répondue
  isQuestionAnswered: (questionId: string): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    return user.answersHistory.some(ans => ans.questionId === questionId);
  },

  // Récupérer la réponse de l'utilisateur pour une question
  getUserAnswer: (questionId: string): UserAnswer | null => {
    const user = authService.getCurrentUser();
    if (!user) return null;
    return user.answersHistory.find(ans => ans.questionId === questionId) || null;
  },

  // Obtenir les statistiques de progression
  getProgressStats: (): ProgressStats => {
    const user = authService.getCurrentUser();
    const questions = questionService.getAllQuestions();

    if (!user) {
      return {
        totalQuestions: questions.length,
        answeredQuestions: 0,
        averageScore: 0,
        scoreByCategory: {} as Record<Category, number>,
        scoreByRole: {} as Record<Role, number>,
        scoreByPhase: {} as Record<GamePhase, number>
      };
    }

    const stats: ProgressStats = {
      totalQuestions: questions.length,
      answeredQuestions: user.answersHistory.length,
      averageScore: user.totalScore,
      scoreByCategory: {} as Record<Category, number>,
      scoreByRole: {} as Record<Role, number>,
      scoreByPhase: {} as Record<GamePhase, number>
    };

    // Calculer les scores par catégorie
    const categoryCounts: Record<string, number> = {};
    const roleCounts: Record<string, number> = {};
    const phaseCounts: Record<string, number> = {};

    user.answersHistory.forEach(ans => {
      const question = questionService.getQuestionById(ans.questionId);
      if (!question) return;

      // Par catégorie
      if (!stats.scoreByCategory[question.category]) {
        stats.scoreByCategory[question.category] = 0;
        categoryCounts[question.category] = 0;
      }
      stats.scoreByCategory[question.category] += ans.score;
      categoryCounts[question.category]++;

      // Par rôle
      if (!stats.scoreByRole[question.role]) {
        stats.scoreByRole[question.role] = 0;
        roleCounts[question.role] = 0;
      }
      stats.scoreByRole[question.role] += ans.score;
      roleCounts[question.role]++;

      // Par phase
      if (!stats.scoreByPhase[question.gamePhase]) {
        stats.scoreByPhase[question.gamePhase] = 0;
        phaseCounts[question.gamePhase] = 0;
      }
      stats.scoreByPhase[question.gamePhase] += ans.score;
      phaseCounts[question.gamePhase]++;
    });

    // Calculer les moyennes
    Object.keys(stats.scoreByCategory).forEach(cat => {
      stats.scoreByCategory[cat as Category] = Math.round(
        stats.scoreByCategory[cat as Category] / categoryCounts[cat]
      );
    });
    Object.keys(stats.scoreByRole).forEach(role => {
      stats.scoreByRole[role as Role] = Math.round(
        stats.scoreByRole[role as Role] / roleCounts[role]
      );
    });
    Object.keys(stats.scoreByPhase).forEach(phase => {
      stats.scoreByPhase[phase as GamePhase] = Math.round(
        stats.scoreByPhase[phase as GamePhase] / phaseCounts[phase]
      );
    });

    return stats;
  }
};
