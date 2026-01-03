import { useState } from 'react';
import { Question } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { ArrowLeft, Send } from 'lucide-react';

interface ExerciseQuestionProps {
  question: Question;
  onSubmit: (answerId: string) => void;
  onBack: () => void;
}

export function ExerciseQuestion({ question, onSubmit, onBack }: ExerciseQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const handleSubmit = () => {
    if (selectedAnswer) {
      onSubmit(selectedAnswer);
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      draft: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      macro: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      items: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      rôles: 'bg-green-500/10 text-green-500 border-green-500/20',
      phase: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    };
    return colors[category] || '';
  };

  const getPhaseEmoji = (phase: string): string => {
    const emojis: Record<string, string> = {
      early: '🌅',
      mid: '☀️',
      late: '🌙',
      général: '⭐'
    };
    return emojis[phase] || '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getCategoryColor(question.category)}>
              {question.category}
            </Badge>
            <Badge variant="outline">
              {question.role}
            </Badge>
            <Badge variant="outline">
              {getPhaseEmoji(question.gamePhase)} {question.gamePhase}
            </Badge>
          </div>

          {/* Affichage image ou vidéo si présent */}
          {question.imageUrl && (
            <div className="my-4 flex justify-center">
              <img src={question.imageUrl} alt="Illustration" className="max-h-64 rounded shadow" />
            </div>
          )}
          {question.videoUrl && (
            <div className="my-4 flex justify-center">
              <video src={question.videoUrl} controls className="max-h-64 rounded shadow" />
            </div>
          )}

          <div className="space-y-2">
            <CardDescription>Contexte</CardDescription>
            <CardTitle className="text-lg leading-relaxed">
              {question.context}
            </CardTitle>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <CardDescription>Question</CardDescription>
            <p className="text-xl">
              {question.question}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            <div className="space-y-3">
              {question.answers.map((answer, index) => (
                <div key={answer.id} className="relative">
                  <div 
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedAnswer === answer.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedAnswer(answer.id)}
                  >
                    <RadioGroupItem value={answer.id} id={answer.id} className="mt-1" />
                    <Label 
                      htmlFor={answer.id} 
                      className="flex-1 cursor-pointer leading-relaxed"
                    >
                      <span className="mr-2 text-muted-foreground">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {answer.text}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>

          <Button 
            onClick={handleSubmit} 
            disabled={!selectedAnswer}
            className="w-full"
            size="lg"
          >
            <Send className="mr-2 h-4 w-4" />
            Valider ma réponse
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Prenez votre temps, il n'y a pas de limite de temps
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
