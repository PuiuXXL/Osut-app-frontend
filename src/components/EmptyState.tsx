import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { spacing, palette } from '@/styles/theme';

type Props = {
  title?: string;
  message?: string;
};

const EmptyState = ({ title = 'Nothing here yet', message }: Props) => (
  <View style={styles.container}>
    <Text variant="titleMedium" style={styles.title}>
      {title}
    </Text>
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    color: palette.primary,
    fontWeight: '600',
  },
  message: {
    color: palette.muted,
    textAlign: 'center',
  },
});

export default EmptyState;
