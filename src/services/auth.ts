import { baseClient } from './api';
import { AuthTokens } from '@/types/api';

export const loginWithIdToken = async (idToken: string): Promise<AuthTokens> => {
  const { data } = await baseClient.post<AuthTokens>('/api/Auth/login', { idToken });
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
};

export const logoutSession = async (refreshToken: string) => {
  await baseClient.post('/api/Auth/logout', { refreshToken });
};
