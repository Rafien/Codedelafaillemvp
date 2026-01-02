import { User } from '../types';

const STORAGE_KEY = 'code_faille_user';
const USERS_KEY = 'code_faille_users';

// Utilisateurs mockés par défaut
const defaultUsers: User[] = [
  {
    id: 'admin',
    username: 'admin',
    isAdmin: true,
    totalScore: 0,
    answersHistory: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'user',
    username: 'joueur',
    isAdmin: false,
    totalScore: 0,
    answersHistory: [],
    createdAt: new Date().toISOString()
  }
];

export const authService = {
  // Initialiser les utilisateurs si pas présents
  initUsers: (): void => {
    const users = localStorage.getItem(USERS_KEY);
    if (!users) {
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }
  },

  // Connexion (login simple par username)
  login: (username: string): User | null => {
    authService.initUsers();
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }
    
    // Créer un nouvel utilisateur si n'existe pas
    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      isAdmin: false,
      totalScore: 0,
      answersHistory: [],
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  // Déconnexion
  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Récupérer l'utilisateur connecté
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Mettre à jour l'utilisateur
  updateUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    
    // Mettre à jour aussi dans la liste des utilisateurs
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  // Vérifier si un utilisateur est admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.isAdmin ?? false;
  }
};
