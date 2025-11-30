import { Platform } from 'react-native';

const DEFAULT_ANDROID_BASE = 'http://10.0.2.2:5202';
const DEFAULT_IOS_BASE = 'https://localhost:7202';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android' ? DEFAULT_ANDROID_BASE : DEFAULT_IOS_BASE);

export const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '';
export const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';
export const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '';

export const REQUEST_TIMEOUT = 15000;

export const ENABLE_MOCKS = (process.env.EXPO_PUBLIC_ENABLE_MOCKS ?? '').toLowerCase() === 'true';
