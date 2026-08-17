import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { clearAuthTokens } from '../api/client';

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

const API_BASE_URL = '/api/v1/auth';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

const PUBLIC_AUTH_PATHS = new Set([
  '/login',
  '/register',
  '/verify-otp',
  '/pin-setup',
  '/verify-pin',
  '/forgot-password',
  '/reset-password',
  '/',
]);

async function verifyToken(): Promise<User | null> {
  try {
    const response = await authClient.get('/verify-token');

    const json = response.data as {
      success?: boolean;
      data?: {
        user?: {
          id: string;
          sub: string;
          role: string;
          sessionId: string;
        };
      };
    };

    if (!json.success || !json.data?.user) {
      return null;
    }

    const verifiedUser = json.data.user;

    try {
      const profileResponse = await axios.get('/api/v1/users/me', {
        withCredentials: true,
        timeout: 5000,
      });
      const profileJson = profileResponse.data as {
        success?: boolean;
        data?: {
          firstName?: string;
          lastName?: string;
          email?: string;
        };
      };
      if (profileJson.success && profileJson.data) {
        return {
          ...verifiedUser,
          firstName: profileJson.data.firstName,
          lastName: profileJson.data.lastName,
          email: profileJson.data.email,
        } as User;
      }
    } catch (err) {
      console.warn('Failed to fetch full user profile:', err);
    }

    return verifiedUser as User;
  } catch {
    return null;
  }
}

async function logoutApi(): Promise<void> {
  try {
    await authClient.post('/logout');
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
        if (
          typeof window !== 'undefined' &&
          ['/login', '/register'].includes(window.location.pathname)
        ) {
          try {
            await logoutApi();
          } catch (err) {
            console.warn('Logout api failed:', err);
          }
          clearAuthTokens();
          setUserState(null);
          setIsAuthenticated(false);
        }
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
