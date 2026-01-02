import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LogIn } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  const handleQuickLogin = (user: string) => {
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl">⚔️ Code de la Faille</CardTitle>
          <CardDescription>
            Améliorez vos décisions sur League of Legends
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm">
                Nom d'utilisateur
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Entrez votre pseudo"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full" disabled={!username.trim()}>
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou connexion rapide
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleQuickLogin('joueur')}
              className="w-full"
            >
              👤 Joueur
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickLogin('admin')}
              className="w-full"
            >
              🔑 Admin
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Les comptes sont stockés localement dans votre navigateur
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
