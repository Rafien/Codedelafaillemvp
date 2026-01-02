import { useState, useMemo } from 'react';
import { Question, Category, Role, GamePhase } from '../types';
import { questionService } from '../services/questionService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CheckCircle2, Circle, Play } from 'lucide-react';

interface ExerciseListProps {
  questions: Question[];
  onSelectQuestion: (questionId: string) => void;
}

export function ExerciseList({ questions, onSelectQuestion }: ExerciseListProps) {
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [phaseFilter, setPhaseFilter] = useState<GamePhase | 'all'>('all');

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
      if (roleFilter !== 'all' && q.role !== roleFilter) return false;
      if (phaseFilter !== 'all' && q.gamePhase !== phaseFilter) return false;
      return true;
    });
  }, [questions, categoryFilter, roleFilter, phaseFilter]);

  const getCategoryColor = (category: Category): string => {
    const colors: Record<Category, string> = {
      draft: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      macro: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      items: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      rôles: 'bg-green-500/10 text-green-500 border-green-500/20',
      phase: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    };
    return colors[category] || '';
  };

  const getPhaseEmoji = (phase: GamePhase): string => {
    const emojis: Record<GamePhase, string> = {
      early: '🌅',
      mid: '☀️',
      late: '🌙',
      général: '⭐'
    };
    return emojis[phase];
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Catégorie</label>
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as Category | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="macro">Macro</SelectItem>
                  <SelectItem value="items">Items</SelectItem>
                  <SelectItem value="rôles">Rôles</SelectItem>
                  <SelectItem value="phase">Phase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Rôle</label>
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as Role | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="jungle">Jungle</SelectItem>
                  <SelectItem value="mid">Mid</SelectItem>
                  <SelectItem value="adc">ADC</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="général">Général</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Phase de jeu</label>
              <Select value={phaseFilter} onValueChange={(v) => setPhaseFilter(v as GamePhase | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="early">Early Game</SelectItem>
                  <SelectItem value="mid">Mid Game</SelectItem>
                  <SelectItem value="late">Late Game</SelectItem>
                  <SelectItem value="général">Général</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">
            Exercices ({filteredQuestions.length})
          </h2>
        </div>

        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Aucun exercice trouvé avec ces filtres
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredQuestions.map((question, index) => {
              const isAnswered = questionService.isQuestionAnswered(question.id);
              const userAnswer = questionService.getUserAnswer(question.id);

              return (
                <Card key={question.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-muted-foreground">#{index + 1}</span>
                          <Badge className={getCategoryColor(question.category)}>
                            {question.category}
                          </Badge>
                          <Badge variant="outline">
                            {question.role}
                          </Badge>
                          <Badge variant="outline">
                            {getPhaseEmoji(question.gamePhase)} {question.gamePhase}
                          </Badge>
                          {isAnswered && userAnswer && (
                            <Badge 
                              variant={userAnswer.score === 100 ? 'default' : userAnswer.score >= 50 ? 'secondary' : 'destructive'}
                            >
                              {userAnswer.score}%
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-base">
                          {question.context.substring(0, 150)}
                          {question.context.length > 150 ? '...' : ''}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAnswered ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => onSelectQuestion(question.id)}
                      className="w-full"
                      variant={isAnswered ? "outline" : "default"}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {isAnswered ? 'Refaire l\'exercice' : 'Commencer l\'exercice'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
