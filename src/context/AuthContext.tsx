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
  '/verify-email',
  '/pin-setup',
  '/verify-pin',
  '/forgot-password',
  '/reset-password',
  '/',
]);

const userClient = axios.create({
  baseURL: '/api/v1/users',
  withCredentials: true,
  timeout: 10000,
});

async function fetchUserProfile(): Promise<Partial<User> | null> {
  try {
    const res = await userClient.get<{
      success: boolean;
      data?: Partial<User>;
    }>('/me');
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
    return null;
  } catch {
    return null;
  }
}

async function verifyToken(): Promise<User | null> {
  try {
    const res = await authClient.get<{
      success: boolean;
      user?: User;
      data?: { user?: User };
    }>('/verify-token');

    if (res.data?.success) {
      const baseUser = res.data.user ?? res.data.data?.user ?? null;
      if (!baseUser) return null;

      const profile = await fetchUserProfile();
      if (profile) {
        return { ...baseUser, ...profile } as User;
      }
      return baseUser;
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

  const login = useCallback((userData: User) => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('explicitLogout');
      sessionStorage.removeItem('loggedOut');
    }
    setUserState(userData);
    setIsAuthenticated(true);
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('explicitLogout', 'true');
        sessionStorage.setItem('loggedOut', 'true');
      }
      await authClient.post('/logout');
    } catch (err) {
      console.warn('Logout request error:', err);
    } finally {
      clearAuthTokens();
      setUserState(null);
      setIsAuthenticated(false);
      setError(null);
      if (typeof window !== 'undefined' && !['/login', '/'].includes(window.location.pathname)) {
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
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('explicitLogout');
          sessionStorage.removeItem('loggedOut');
        }
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
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('explicitLogout');
              sessionStorage.removeItem('loggedOut');
            }
            return true;
          }
        }
      } catch (e) {
        console.debug('Refresh token failed', e);
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('loggedOut', 'true');
      }
      setUserState(null);
      setIsAuthenticated(false);
      return false;
    } catch (err) {
      console.error('verifyAuth failed:', err);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('loggedOut', 'true');
      }
      setUserState(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const path = typeof window !== 'undefined' ? window.location.pathname : '';

      const isLoggedOut =
        typeof window !== 'undefined' &&
        (sessionStorage.getItem('explicitLogout') === 'true' ||
          sessionStorage.getItem('loggedOut') === 'true');

      if (PUBLIC_AUTH_PATHS.has(path) && isLoggedOut) {
        setUserState(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      await verifyAuth();
    };
    checkAuth();
  }, [verifyAuth]);

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
