import { DarkTheme as NavigationDarkTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { MD3DarkTheme as PaperDarkTheme } from 'react-native-paper';

export const palette = {
  primary: '#C1121F',
  secondary: '#E01E37',
  background: '#0B0B0F',
  surface: '#121218',
  muted: '#9CA3AF',
  border: '#1F2937',
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#F43F5E',
};

export const paperTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.background,
    surface: palette.surface,
    outline: palette.border,
    error: palette.error,
    onSurface: '#F9FAFB',
    onSurfaceVariant: '#E5E7EB',
  },
  roundness: 12,
};

export const navigationTheme: NavigationTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: palette.primary,
    background: palette.background,
    card: palette.surface,
    border: palette.border,
    text: '#F9FAFB',
    notification: palette.secondary,
  },
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};
