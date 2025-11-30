import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT } from '@/constants/env';
import { AuthTokens } from '@/types/api';

type LogoutHandler = (() => void | Promise<void>) | null;
type TokenListener = ((tokens: AuthTokens) => void | Promise<void>) | null;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
});

const baseClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
});

let tokens: AuthTokens | null = null;
let logoutHandler: LogoutHandler = null;
let tokenListener: TokenListener = null;

export const setAuthTokens = (nextTokens: AuthTokens | null) => {
  tokens = nextTokens;
};

export const setLogoutHandler = (handler: LogoutHandler) => {
  logoutHandler = handler;
};

export const setTokenListener = (listener: TokenListener) => {
  tokenListener = listener;
};

export const getAuthTokens = () => tokens;

export const refreshAccessToken = async (): Promise<AuthTokens> => {
  if (!tokens?.refreshToken) {
    throw new Error('Missing refresh token');
  }

  const { data } = await baseClient.post<AuthTokens>('/api/Auth/refresh', {
    refreshToken: tokens.refreshToken,
  });

  const freshTokens: AuthTokens = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };

  setAuthTokens(freshTokens);
  if (tokenListener) {
    await tokenListener(freshTokens);
  }
  return freshTokens;
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (tokens?.accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (status === 401 && tokens?.refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const freshTokens = await refreshAccessToken();
        originalRequest.headers = {
          ...(originalRequest.headers ?? {}),
          Authorization: `Bearer ${freshTokens.accessToken}`,
        };
        return api(originalRequest);
      } catch (refreshError) {
        if (logoutHandler) {
          await logoutHandler();
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
export { baseClient };
