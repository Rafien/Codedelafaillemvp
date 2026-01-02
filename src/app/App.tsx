import { useState, useEffect } from 'react';
import { authService } from './services/auth';
import { questionService } from './services/questionService';
import { User, Question } from './types';
import { LoginPage } from './components/LoginPage';
import { ExerciseList } from './components/ExerciseList';
import { ExerciseQuestion } from './components/ExerciseQuestion';
import { ExerciseResult } from './components/ExerciseResult';
import { ProgressDashboard } from './components/ProgressDashboard';
import { AdminPanel } from './components/AdminPanel';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { BookOpen, BarChart3, Shield, LogOut, Trophy } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

type View = 'exercises' | 'progress' | 'admin';
type ExerciseState = 'list' | 'question' | 'result';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentView, setCurrentView] = useState<View>('exercises');
  const [exerciseState, setExerciseState] = useState<ExerciseState>('list');
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    // Vérifier si un utilisateur est connecté
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Initialiser les données
    authService.initUsers();
    questionService.initQuestions();
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    setQuestions(questionService.getAllQuestions());
  };

  const handleLogin = (username: string) => {
    const loggedUser = authService.login(username);
    if (loggedUser) {
      setUser(loggedUser);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView('exercises');
    setExerciseState('list');
  };

  const handleSelectQuestion = (questionId: string) => {
    setCurrentQuestionId(questionId);
    setExerciseState('question');
  };

  const handleSubmitAnswer = (answerId: string) => {
    if (!currentQuestionId) return;

    const resultScore = questionService.submitAnswer(currentQuestionId, answerId);
    setSelectedAnswerId(answerId);
    setScore(resultScore);
    setExerciseState('result');

    // Rafraîchir l'utilisateur pour les stats
    const updatedUser = authService.getCurrentUser();
    if (updatedUser) {
      setUser(updatedUser);
    }
  };

  const handleNextQuestion = () => {
    setExerciseState('list');
    setCurrentQuestionId(null);
    setSelectedAnswerId(null);
    setScore(0);
  };

  const handleRetryQuestion = () => {
    setExerciseState('question');
    setSelectedAnswerId(null);
    setScore(0);
  };

  const handleBackToList = () => {
    setExerciseState('list');
    setCurrentQuestionId(null);
  };

  const handleQuestionsChange = () => {
    loadQuestions();
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const currentQuestion = currentQuestionId ? questionService.getQuestionById(currentQuestionId) : null;
  const stats = questionService.getProgressStats();

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl">Code de la Faille</h1>
                <p className="text-sm text-muted-foreground">
                  Entraînement League of Legends
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm">{user.username}</p>
                <p className="text-xs text-muted-foreground">
                  Score moyen: {user.totalScore}/100
                </p>
              </div>
              {user.isAdmin && (
                <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded border border-primary/20">
                  Admin
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {exerciseState !== 'list' && currentQuestion ? (
          <div>
            {exerciseState === 'question' && (
              <ExerciseQuestion
                question={currentQuestion}
                onSubmit={handleSubmitAnswer}
                onBack={handleBackToList}
              />
            )}
            {exerciseState === 'result' && selectedAnswerId && (
              <ExerciseResult
                question={currentQuestion}
                selectedAnswerId={selectedAnswerId}
                score={score}
                onNext={handleNextQuestion}
                onRetry={handleRetryQuestion}
              />
            )}
          </div>
        ) : (
          <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as View)}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="exercises">
                <BookOpen className="h-4 w-4 mr-2" />
                Exercices
              </TabsTrigger>
              <TabsTrigger value="progress">
                <BarChart3 className="h-4 w-4 mr-2" />
                Progression
              </TabsTrigger>
              {user.isAdmin && (
                <TabsTrigger value="admin">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="exercises">
              <ExerciseList
                questions={questions}
                onSelectQuestion={handleSelectQuestion}
              />
            </TabsContent>

            <TabsContent value="progress">
              <ProgressDashboard stats={stats} />
            </TabsContent>

            {user.isAdmin && (
              <TabsContent value="admin">
                <AdminPanel
                  questions={questions}
                  onQuestionsChange={handleQuestionsChange}
                />
              </TabsContent>
            )}
          </Tabs>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Code de la Faille - Entraînez vos décisions stratégiques sur League of Legends
          </p>
        </div>
      </footer>
    </div>
  );
}
