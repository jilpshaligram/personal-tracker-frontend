import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { clearAuthTokens } from '../api/client';
import { AuthContext, type AuthContextType, type User } from './useAuth';

export type { User } from './useAuth';

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
    const res = await authClient.get<{
      success: boolean;
      user?: User;
      data?: { user?: User };
    }>('/verify-token');

    if (res.data?.success) {
      return res.data.user ?? res.data.data?.user ?? null;
    }
    return null;
  } catch (err: unknown) {
    const axiosError = err as { response?: { status?: number } };
    if (axiosError.response?.status !== 401) {
      console.warn('verify-token error (non-401):', err);
    }
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const shouldSkipAuthCheck = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return true;
    return PUBLIC_AUTH_PATHS.has(path);
  }, []);

  const login = useCallback((userData: User) => {
    setUserState(userData);
    setIsAuthenticated(true);
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authClient.post('/logout');
    } catch (err) {
      console.warn('Logout request error:', err);
    } finally {
      clearAuthTokens();
      setUserState(null);
      setIsAuthenticated(false);
      setError(null);
      if (
        typeof window !== 'undefined' &&
        !['/login', '/'].includes(window.location.pathname) &&
        !window.location.pathname.startsWith('/admin')
      ) {
        window.location.href = '/login';
      }
    }
  }, []);

  const verifyAuth = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const verifiedUser = await verifyToken();

      if (verifiedUser) {
        setUserState(verifiedUser);
        setIsAuthenticated(true);
        return true;
      }

      try {
        const refreshRes = await authClient.post<{
          success: boolean;
          user?: User;
          data?: { user?: User };
        }>('/refresh-token');

        if (refreshRes.data?.success) {
          const refreshedUser = await verifyToken();
          if (refreshedUser) {
            setUserState(refreshedUser);
            setIsAuthenticated(true);
            return true;
          }
        }
      } catch {
        // Refresh token invalid or expired
      }

      setUserState(null);
      setIsAuthenticated(false);
      return false;
    } catch (err) {
      console.error('verifyAuth failed:', err);
      setUserState(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (shouldSkipAuthCheck()) {
        const path = typeof window !== 'undefined' ? window.location.pathname : '';
        if (['/login', '/register', '/verify-otp', '/'].includes(path)) {
          try {
            await authClient.post('/logout');
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
