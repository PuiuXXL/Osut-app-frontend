import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View, Platform } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Screen from '@/components/Screen';
import { useAuth } from '@/hooks/useAuth';
import {
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
} from '@/constants/env';
import { spacing, palette } from '@/styles/theme';
import { ENABLE_MOCKS } from '@/constants/env';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const { login, startDemo, isLoading } = useAuth();
  const [idToken, setIdToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  const googleConfig = useMemo(
    () => ({
      expoClientId: GOOGLE_CLIENT_ID || undefined,
      iosClientId: GOOGLE_IOS_CLIENT_ID || GOOGLE_CLIENT_ID || undefined,
      androidClientId: GOOGLE_ANDROID_CLIENT_ID || GOOGLE_CLIENT_ID || undefined,
      responseType: 'id_token' as const,
      selectAccount: true,
      usePkce: false,
    }),
    [],
  );

  const hasGoogleConfig =
    Boolean(googleConfig.expoClientId) ||
    Boolean(googleConfig.iosClientId && Platform.OS === 'ios') ||
    Boolean(googleConfig.androidClientId && Platform.OS === 'android');

  const [request, response, promptAsync] = hasGoogleConfig
    ? Google.useAuthRequest(googleConfig)
    : [null, null, () => Promise.resolve() as any];

  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.params?.id_token;
      if (token) {
        handleLogin(token);
      }
    }
  }, [response]);

  const handleLogin = async (token: string) => {
    setError(null);
    try {
      await login(token);
    } catch (err) {
      setError('Authentication failed. Please verify the token or whitelist status.');
    }
  };

  return (
    <Screen padded scrollable={false}>
      <View style={styles.hero}>
        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
        <Text variant="headlineSmall" style={styles.title}>
          OSUT Volunteers
        </Text>
        <Text style={styles.subtitle}>
          Sign in to manage events, departments, and your volunteer profile.
        </Text>
      </View>

      <View style={styles.form}>
        <Button mode="contained" onPress={startDemo}>
          Continue in demo mode
        </Button>

        <Button
          mode="contained"
          icon="google"
          disabled={!hasGoogleConfig || isLoading}
          onPress={() => hasGoogleConfig && promptAsync()}
        >
          Continue with Google
        </Button>

        {!hasGoogleConfig ? (
          <Text style={styles.helper}>
            Set `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`, or
            `EXPO_PUBLIC_GOOGLE_CLIENT_ID` to enable Google sign-in. You can still paste an ID token
            below for development.
          </Text>
        ) : null}

        {!ENABLE_MOCKS && (
          <>
            <TextInput
              label="Paste Google ID token"
              value={idToken}
              onChangeText={setIdToken}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
            />
            <Button mode="outlined" disabled={!idToken || isLoading} onPress={() => handleLogin(idToken)}>
              Use pasted token
            </Button>
          </>
        )}
        {error ? (
          <Text style={styles.error} variant="labelLarge">
            {error}
          </Text>
        ) : null}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  logo: {
    width: 96,
    height: 96,
    resizeMode: 'contain',
    marginBottom: spacing.sm,
  },
  title: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    textAlign: 'center',
    color: palette.muted,
    paddingHorizontal: spacing.lg,
  },
  form: {
    gap: spacing.sm,
  },
  helper: {
    color: '#6B7280',
  },
  input: {
    minHeight: 80,
  },
  error: {
    color: '#DC2626',
  },
});

export default LoginScreen;
