import { Question } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ExerciseResultProps {
  question: Question;
  selectedAnswerId: string;
  score: number;
  onNext: () => void;
  onRetry: () => void;
}

export function ExerciseResult({ question, selectedAnswerId, score, onNext, onRetry }: ExerciseResultProps) {
  const selectedAnswer = question.answers.find(a => a.id === selectedAnswerId);
  const correctAnswer = question.answers.find(a => a.score === 100);

  const getResultIcon = () => {
    if (score === 100) return <CheckCircle2 className="h-6 w-6" />;
    if (score >= 50) return <AlertCircle className="h-6 w-6" />;
    return <XCircle className="h-6 w-6" />;
  };

  const getResultColor = () => {
    if (score === 100) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (score >= 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  const getResultTitle = () => {
    if (score === 100) return 'Parfait ! 🎉';
    if (score >= 50) return 'Partiellement correct 👍';
    return 'Incorrect 😔';
  };

  const getResultMessage = () => {
    if (score === 100) return 'Excellente décision ! Vous avez choisi la meilleure réponse.';
    if (score >= 50) return 'Cette réponse a du sens, mais il y a mieux.';
    return 'Ce n\'est pas la bonne décision. Lisez l\'explication pour comprendre pourquoi.';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Résultat du score */}
      <Alert className={getResultColor()}>
        <div className="flex items-start gap-4">
          {getResultIcon()}
          <div className="flex-1 space-y-1">
            <AlertTitle className="text-xl">{getResultTitle()}</AlertTitle>
            <AlertDescription>
              {getResultMessage()}
            </AlertDescription>
            <div className="mt-2">
              <Badge className={getResultColor()} variant="outline">
                Score : {score}/100
              </Badge>
            </div>
          </div>
        </div>
      </Alert>

      {/* Votre réponse */}
      <Card>
        <CardHeader>
          <CardTitle>Votre réponse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg border-2 ${
            score === 100 
              ? 'border-green-500/50 bg-green-500/5' 
              : score >= 50
              ? 'border-amber-500/50 bg-amber-500/5'
              : 'border-red-500/50 bg-red-500/5'
          }`}>
            <p>{selectedAnswer?.text}</p>
            <div className="mt-2 flex items-center gap-2">
              {score === 100 && (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  Meilleure réponse
                </Badge>
              )}
              {score > 0 && score < 100 && (
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  Réponse partielle ({score} points)
                </Badge>
              )}
              {score === 0 && (
                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                  Mauvaise réponse
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Réponse correcte si différente */}
      {score < 100 && correctAnswer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-500">Meilleure réponse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg border-2 border-green-500/50 bg-green-500/5">
              <p>{correctAnswer.text}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Explication pédagogique */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Explication</CardTitle>
          <CardDescription>
            Comprenez pourquoi cette décision est la meilleure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">
            {question.explanation}
          </p>
        </CardContent>
      </Card>

      {/* Toutes les réponses avec leurs scores */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des réponses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {question.answers
              .sort((a, b) => b.score - a.score)
              .map((answer, index) => (
                <div 
                  key={answer.id} 
                  className={`p-4 rounded-lg border ${
                    answer.id === selectedAnswerId 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="flex-1">
                      <span className="text-muted-foreground mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {answer.text}
                    </p>
                    <Badge 
                      variant={answer.score === 100 ? 'default' : answer.score >= 50 ? 'secondary' : 'outline'}
                    >
                      {answer.score}%
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={onRetry} variant="outline" className="flex-1">
          <RotateCcw className="mr-2 h-4 w-4" />
          Refaire cet exercice
        </Button>
        <Button onClick={onNext} className="flex-1">
          Exercice suivant
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
