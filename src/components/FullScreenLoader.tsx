import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { palette, spacing } from '@/styles/theme';

type Props = {
  message?: string;
};

const FullScreenLoader = ({ message = 'Loading...' }: Props) => (
  <View style={styles.container}>
    <ActivityIndicator animating size="large" color={palette.primary} />
    <Text style={styles.label}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: palette.background,
  },
  label: {
    color: palette.muted,
  },
});

export default FullScreenLoader;
