import React, { ReactNode } from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, palette } from '@/styles/theme';

type Props = {
  children: ReactNode;
  padded?: boolean;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
};

const Screen = ({ children, padded = true, scrollable = true, style }: Props) => {
  const contentStyle = [padded && styles.padded, style];
  const content = scrollable ? (
    <ScrollView contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={contentStyle}>{children}</View>
  );

  return <SafeAreaView style={styles.safe}>{content}</SafeAreaView>;
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});

export default Screen;
