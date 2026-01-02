import { useState } from 'react';
import { Question, Answer, Category, Role, GamePhase } from '../types';
import { questionService } from '../services/questionService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, Save, Trash2, Edit, X } from 'lucide-react';
import { toast } from 'sonner';

interface AdminPanelProps {
  questions: Question[];
  onQuestionsChange: () => void;
}

export function AdminPanel({ questions, onQuestionsChange }: AdminPanelProps) {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const emptyQuestion: Question = {
    id: `q_${Date.now()}`,
    context: '',
    question: '',
    answers: [
      { id: `a1_${Date.now()}`, text: '', score: 100 },
      { id: `a2_${Date.now()}`, text: '', score: 0 },
      { id: `a3_${Date.now()}`, text: '', score: 0 },
      { id: `a4_${Date.now()}`, text: '', score: 0 }
    ],
    explanation: '',
    category: 'macro',
    role: 'général',
    gamePhase: 'général',
    createdAt: new Date().toISOString()
  };

  const handleCreate = () => {
    setEditingQuestion({ ...emptyQuestion, id: `q_${Date.now()}` });
    setIsCreating(true);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion({ ...question });
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!editingQuestion) return;

    // Validation
    if (!editingQuestion.context.trim()) {
      toast.error('Le contexte est requis');
      return;
    }
    if (!editingQuestion.question.trim()) {
      toast.error('La question est requise');
      return;
    }
    if (editingQuestion.answers.some(a => !a.text.trim())) {
      toast.error('Toutes les réponses doivent être remplies');
      return;
    }
    if (!editingQuestion.answers.some(a => a.score === 100)) {
      toast.error('Au moins une réponse doit avoir un score de 100');
      return;
    }
    if (!editingQuestion.explanation.trim()) {
      toast.error('L\'explication est requise');
      return;
    }

    const success = questionService.saveQuestion(editingQuestion);
    if (success) {
      toast.success(isCreating ? 'Question créée' : 'Question modifiée');
      setEditingQuestion(null);
      setIsCreating(false);
      onQuestionsChange();
    } else {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      const success = questionService.deleteQuestion(id);
      if (success) {
        toast.success('Question supprimée');
        onQuestionsChange();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const updateAnswer = (index: number, field: 'text' | 'score', value: string | number) => {
    if (!editingQuestion) return;
    const newAnswers = [...editingQuestion.answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setEditingQuestion({ ...editingQuestion, answers: newAnswers });
  };

  if (editingQuestion) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">
            {isCreating ? 'Créer une question' : 'Modifier la question'}
          </h2>
          <Button variant="ghost" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Catégorie</label>
                <Select 
                  value={editingQuestion.category} 
                  onValueChange={(v) => setEditingQuestion({ ...editingQuestion, category: v as Category })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                <Select 
                  value={editingQuestion.role} 
                  onValueChange={(v) => setEditingQuestion({ ...editingQuestion, role: v as Role })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="général">Général</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="jungle">Jungle</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="adc">ADC</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Phase de jeu</label>
                <Select 
                  value={editingQuestion.gamePhase} 
                  onValueChange={(v) => setEditingQuestion({ ...editingQuestion, gamePhase: v as GamePhase })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="général">Général</SelectItem>
                    <SelectItem value="early">Early Game</SelectItem>
                    <SelectItem value="mid">Mid Game</SelectItem>
                    <SelectItem value="late">Late Game</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Contexte</label>
              <Textarea
                value={editingQuestion.context}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, context: e.target.value })}
                placeholder="Décrivez la situation du jeu..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Question</label>
              <Input
                value={editingQuestion.question}
                onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                placeholder="Quelle est la meilleure décision ?"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Réponses</CardTitle>
            <CardDescription>
              Le score va de 0 (mauvaise réponse) à 100 (meilleure réponse)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {editingQuestion.answers.map((answer, index) => (
              <div key={answer.id} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Réponse {String.fromCharCode(65 + index)}
                  </span>
                  {answer.score === 100 && (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      Meilleure réponse
                    </Badge>
                  )}
                  {answer.score > 0 && answer.score < 100 && (
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      Partielle
                    </Badge>
                  )}
                </div>
                <Input
                  value={answer.text}
                  onChange={(e) => updateAnswer(index, 'text', e.target.value)}
                  placeholder="Texte de la réponse"
                />
                <div className="flex items-center gap-2">
                  <label className="text-sm whitespace-nowrap">Score :</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={answer.score}
                    onChange={(e) => updateAnswer(index, 'score', parseInt(e.target.value) || 0)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Explication pédagogique</CardTitle>
            <CardDescription>
              Expliquez pourquoi c'est la meilleure décision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={editingQuestion.explanation}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
              placeholder="Expliquez la logique derrière la meilleure réponse..."
              rows={6}
            />
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full" size="lg">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer la question
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Gestion des questions</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Créer une question
        </Button>
      </div>

      <div className="grid gap-4">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">#{index + 1}</span>
                    <Badge variant="outline">{question.category}</Badge>
                    <Badge variant="outline">{question.role}</Badge>
                    <Badge variant="outline">{question.gamePhase}</Badge>
                  </div>
                  <CardTitle className="text-base">
                    {question.context.substring(0, 100)}...
                  </CardTitle>
                  <CardDescription>
                    {question.question}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleEdit(question)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(question.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {questions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucune question disponible. Créez-en une !
          </CardContent>
        </Card>
      )}
    </div>
  );
}
