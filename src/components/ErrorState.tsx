import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { spacing, palette } from '@/styles/theme';

type Props = {
  message?: string;
  onRetry?: () => void;
};

const ErrorState = ({ message = 'Something went wrong', onRetry }: Props) => (
  <View style={styles.container}>
    <Text style={styles.text}>{message}</Text>
    {onRetry && (
      <Button mode="contained-tonal" onPress={onRetry}>
        Try again
      </Button>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  text: {
    textAlign: 'center',
    color: palette.muted,
  },
});

export default ErrorState;
