import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3005/api/v1';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

type AuthRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_COOKIE);
}

export function setRefreshToken(token: string): void {
  document.cookie = `${REFRESH_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Strict`;
}

export function clearAuthTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  document.cookie = `${REFRESH_TOKEN_COOKIE}=; path=/; max-age=0`;
}

function logout(): void {
  clearAuthTokens();
  if (!['/login', '/'].includes(window.location.pathname)) {
    window.location.href = '/login';
  }
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  const { data } = await axios.post(
    `${API_BASE_URL}/auth/refresh-token`,
    refreshToken ? { refreshToken } : {},
    { withCredentials: true }
  );

  const accessToken = data.accessToken ?? data.token ?? data.data?.accessToken ?? data.data?.token;

  if (!accessToken) throw new Error('Unable to refresh session');

  setAccessToken(accessToken);

  const newRefreshToken = data.refreshToken ?? data.data?.refreshToken;
  if (newRefreshToken) setRefreshToken(newRefreshToken);

  return accessToken;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
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

      const token = await refreshPromise;
      config.headers.Authorization = `Bearer ${token}`;
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
