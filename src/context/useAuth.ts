import { createContext, useContext } from 'react';

export interface User {
  id: string;
  sub: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  sessionId: string;
  phone?: string;
  isEmailVerified?: boolean;
  isPinCreated?: boolean;
  avatar?: string;
  profileImage?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<boolean>;
  checkAuth?: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
