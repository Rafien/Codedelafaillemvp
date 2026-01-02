import { useMemo } from 'react';
import { ProgressStats } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Target, TrendingUp } from 'lucide-react';

interface ProgressDashboardProps {
  stats: ProgressStats;
}

export function ProgressDashboard({ stats }: ProgressDashboardProps) {
  const completionRate = stats.totalQuestions > 0 
    ? Math.round((stats.answeredQuestions / stats.totalQuestions) * 100)
    : 0;

  const categoryData = useMemo(() => {
    return Object.entries(stats.scoreByCategory).map(([category, score]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      score: score
    }));
  }, [stats.scoreByCategory]);

  const roleData = useMemo(() => {
    return Object.entries(stats.scoreByRole).map(([role, score]) => ({
      name: role.charAt(0).toUpperCase() + role.slice(1),
      score: score
    }));
  }, [stats.scoreByRole]);

  const phaseData = useMemo(() => {
    return Object.entries(stats.scoreByPhase).map(([phase, score]) => ({
      name: phase === 'early' ? 'Early' : phase === 'mid' ? 'Mid' : phase === 'late' ? 'Late' : 'Général',
      score: score
    }));
  }, [stats.scoreByPhase]);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const getBarColor = (score: number): string => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Score moyen</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${getScoreColor(stats.averageScore)}`}>
              {stats.averageScore}/100
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sur {stats.answeredQuestions} questions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Progression</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {stats.answeredQuestions}/{stats.totalQuestions}
            </div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completionRate}% complété
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.averageScore >= 80 && (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  Excellent
                </Badge>
              )}
              {stats.averageScore >= 60 && stats.averageScore < 80 && (
                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  Bon
                </Badge>
              )}
              {stats.averageScore >= 40 && stats.averageScore < 60 && (
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  Moyen
                </Badge>
              )}
              {stats.averageScore < 40 && stats.answeredQuestions > 0 && (
                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                  À améliorer
                </Badge>
              )}
              {stats.answeredQuestions === 0 && (
                <Badge variant="outline">Pas encore de données</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Continuez à vous entraîner !
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scores par catégorie */}
      {categoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scores par catégorie</CardTitle>
            <CardDescription>
              Vos performances selon les types d'exercices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Scores par rôle */}
      {roleData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scores par rôle</CardTitle>
            <CardDescription>
              Vos performances selon les rôles League of Legends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Scores par phase */}
      {phaseData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scores par phase de jeu</CardTitle>
            <CardDescription>
              Vos performances selon les moments de la partie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={phaseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {phaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {stats.answeredQuestions === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Commencez à répondre aux exercices pour voir vos statistiques de progression
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
