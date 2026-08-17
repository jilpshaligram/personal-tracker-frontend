import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, clearAuthTokens } from '../api/client';

export interface User {
  id: string;
  sub: string;
  role: string;
  sessionId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<boolean>;
}

const PUBLIC_AUTH_PATHS = new Set([
  '/login',
  '/register',
  '/verify-otp',
  '/pin-setup',
  '/verify-pin',
  '/forgot-password',
  '/reset-password',
]);

async function verifyToken(): Promise<User | null> {
  try {
    const response = await apiClient.get('/auth/verify-token');

    const json = response.data as {
      success?: boolean;
      data?: { user?: unknown };
      user?: unknown;
    };

    const userData = (json.data?.user || json.user || json.data || response.data) as
      User | undefined;
    if (
      userData &&
      typeof userData === 'object' &&
      ('id' in userData || 'sub' in userData || 'email' in userData)
    ) {
      return userData;
    }

    if (json.success && json.data) {
      return json.data as unknown as User;
    }

    return null;
  } catch {
    return null;
  }
}

async function logoutApi(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    return;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verifyAuth = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // 1. Check if PIN verification has been completed for this session
    const isPinVerified = sessionStorage.getItem('pinVerified') === 'true';
    if (!isPinVerified) {
      setUserState(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }

    // 2. User has verified PIN -> verify session with backend endpoint /auth/verify-token
    try {
      const verifiedUser = await verifyToken();

      if (verifiedUser) {
        setUserState(verifiedUser);
        setIsAuthenticated(true);
        return true;
      }

      setUserState(null);
      setIsAuthenticated(false);
      return false;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication check failed';
      setError(message);
      setUserState(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((newUser: User) => {
    sessionStorage.setItem('pinVerified', 'true');
    setUserState(newUser);
    setIsAuthenticated(true);
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    await logoutApi();
    clearAuthTokens();
    setUserState(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const shouldSkipAuthCheck = useCallback((): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }

    return PUBLIC_AUTH_PATHS.has(window.location.pathname);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (shouldSkipAuthCheck()) {
        setIsLoading(false);
        return;
      }

      await verifyAuth();
    };
    checkAuth();
  }, [verifyAuth, shouldSkipAuthCheck]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    verifyAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
