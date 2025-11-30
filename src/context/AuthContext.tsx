import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { loginWithIdToken, logoutSession } from '@/services/auth';
import { fetchUserById } from '@/services/users';
import { AuthTokens, User } from '@/types/api';
import { setAuthTokens, setLogoutHandler, setTokenListener } from '@/services/api';
import { ENABLE_MOCKS } from '@/constants/env';
import { MOCK_USER } from '@/constants/mockData';

type AuthContextValue = {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  isBootstrapping: boolean;
  isLoading: boolean;
  login: (idToken: string) => Promise<void>;
  startDemo: () => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const STORAGE_KEYS = {
  access: '@osut/auth/accessToken',
  refresh: '@osut/auth/refreshToken',
} as const;

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const persistTokens = useCallback(async (nextTokens: AuthTokens | null) => {
    if (nextTokens) {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.access, nextTokens.accessToken],
        [STORAGE_KEYS.refresh, nextTokens.refreshToken],
      ]);
    } else {
      await AsyncStorage.multiRemove([STORAGE_KEYS.access, STORAGE_KEYS.refresh]);
    }
  }, []);

  const hydrateUser = useCallback(
    async (accessToken?: string) => {
      const tokenToUse = accessToken ?? tokens?.accessToken;
      if (!tokenToUse) return;

      try {
        const decoded = jwtDecode<{ sub?: string }>(tokenToUse);
        if (!decoded?.sub) return;
        const profile = await fetchUserById(decoded.sub);
        setUser(profile);
      } catch (error) {
        console.warn('Failed to load user profile', error);
      }
    },
    [tokens?.accessToken],
  );

  const login = useCallback(
    async (idToken: string) => {
      setIsLoading(true);
      try {
        const authTokens = await loginWithIdToken(idToken);
        setTokens(authTokens);
        setAuthTokens(authTokens);
        await persistTokens(authTokens);
        await hydrateUser(authTokens.accessToken);
      } finally {
        setIsLoading(false);
      }
    },
    [hydrateUser, persistTokens],
  );

  const logout = useCallback(async () => {
    try {
      if (tokens?.refreshToken) {
        await logoutSession(tokens.refreshToken);
      }
    } catch {
      // Ignore backend logout errors and clear local state anyway.
    } finally {
      setTokens(null);
      setAuthTokens(null);
      setUser(null);
      setIsDemo(false);
      await persistTokens(null);
    }
  }, [persistTokens, tokens]);

  const startDemo = useCallback(() => {
    setUser(MOCK_USER);
    setTokens(null);
    setAuthTokens(null);
    setIsDemo(true);
  }, []);

  const refreshProfile = useCallback(async () => {
    await hydrateUser();
  }, [hydrateUser]);

  useEffect(() => {
    setLogoutHandler(() => logout);
  }, [logout]);

  useEffect(() => {
    setTokenListener(async (freshTokens) => {
      setTokens(freshTokens);
      setAuthTokens(freshTokens);
      await persistTokens(freshTokens);
    });
  }, [persistTokens]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [[, accessToken], [, refreshToken]] = await AsyncStorage.multiGet([
          STORAGE_KEYS.access,
          STORAGE_KEYS.refresh,
        ]);

        if (accessToken && refreshToken) {
          const storedTokens: AuthTokens = { accessToken, refreshToken };
          setTokens(storedTokens);
          setAuthTokens(storedTokens);
          await hydrateUser(accessToken);
        }
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, [hydrateUser]);

  const isAuthenticated = isDemo || Boolean(tokens?.accessToken);

  const value = useMemo(
    () => ({
      user,
      tokens,
      isAuthenticated,
      isDemo,
      isBootstrapping,
      isLoading,
      login,
      startDemo,
      logout,
      refreshProfile,
    }),
    [isAuthenticated, isBootstrapping, isLoading, login, logout, refreshProfile, tokens, user, isDemo, startDemo],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
