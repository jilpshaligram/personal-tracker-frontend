import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

type AuthRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function setCookie(name: string, value: string, maxAge = 604800): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function removeCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export interface DecodedTokenPayload {
  id?: string;
  sub?: string;
  email?: string;
  role?: string;
  sessionId?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export function decodeJwtPayload(token: string | null | undefined): DecodedTokenPayload | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonStr) as DecodedTokenPayload;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') {
    // If it's not a standard JWT with exp or format, consider valid if token exists
    return false;
  }
  // Clock skew tolerance buffer of 5 seconds
  return payload.exp * 1000 <= Date.now() + 5000;
}

export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  const payload = decodeJwtPayload(token);
  let maxAge = 900; // default 15 minutes
  if (payload?.exp) {
    const remaining = Math.floor(payload.exp - Date.now() / 1000);
    if (remaining > 0) maxAge = remaining;
  }
  setCookie(ACCESS_TOKEN_KEY, token, maxAge);
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  const payload = decodeJwtPayload(token);
  let maxAge = 604800; // default 7 days
  if (payload?.exp) {
    const remaining = Math.floor(payload.exp - Date.now() / 1000);
    if (remaining > 0) maxAge = remaining;
  }
  setCookie(REFRESH_TOKEN_KEY, token, maxAge);
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearAuthTokens(): void {
  removeCookie(ACCESS_TOKEN_KEY);
  removeCookie(REFRESH_TOKEN_KEY);
  removeCookie('sessionId');
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem('pinVerified');
  sessionStorage.removeItem('verifyPinAccess');
}

export function isRefreshTokenValid(): boolean {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  return !isJwtExpired(refreshToken);
}

export function logout(): void {
  clearAuthTokens();
  if (typeof window !== 'undefined' && !['/login', '/'].includes(window.location.pathname)) {
    window.location.href = '/login';
  }
}

let refreshPromise: Promise<string> | null = null;

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (refreshToken && isJwtExpired(refreshToken)) {
    clearAuthTokens();
    throw new Error('Refresh token is expired');
  }

  const { data } = await axios.post(
    `${API_BASE_URL}/auth/refresh-token`,
    refreshToken ? { refreshToken } : {},
    { withCredentials: true }
  );

  const accessToken = data.accessToken ?? data.token ?? data.data?.accessToken ?? data.data?.token;

  if (!accessToken) {
    throw new Error('Unable to refresh session');
  }

  setAccessToken(accessToken);

  const newRefreshToken = data.refreshToken ?? data.data?.refreshToken;
  if (newRefreshToken) {
    setRefreshToken(newRefreshToken);
  }

  return accessToken;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  config.withCredentials = true;
  const token = getAccessToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AuthRequestConfig | undefined;

    if (!config || error.response?.status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    if (config.url?.includes('/auth/refresh-token')) {
      logout();
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });

      const newAccessToken = await refreshPromise;
      if (config.headers) {
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      }
      return apiClient(config);
    } catch {
      logout();
      return Promise.reject(error);
    }
  }
);

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string })?.message ?? error.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
