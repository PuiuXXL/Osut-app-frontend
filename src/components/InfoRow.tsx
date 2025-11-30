import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { spacing, palette } from '@/styles/theme';

type Props = {
  label: string;
  value?: string | number | null;
};

const InfoRow = ({ label, value }: Props) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value ?? '—'}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.xs,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default InfoRow;
