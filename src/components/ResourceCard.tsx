import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import { spacing, palette } from '@/styles/theme';

type Props = {
  title: string;
  subtitle?: string;
  meta?: string;
  chips?: string[];
  onPress?: () => void;
  rightContent?: React.ReactNode;
};

const ResourceCard = ({ title, subtitle, meta, chips, onPress, rightContent }: Props) => (
  <Card style={styles.card} mode="elevated" onPress={onPress}>
    <Card.Title
      title={title}
      subtitle={subtitle}
      right={() => (rightContent ? <View style={styles.right}>{rightContent}</View> : null)}
    />
    {(meta || (chips && chips.length)) && (
      <Card.Content>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        {chips ? (
          <View style={styles.chips}>
            {chips.map((chip) => (
              <Chip key={chip} compact>
                {chip}
              </Chip>
            ))}
          </View>
        ) : null}
      </Card.Content>
    )}
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderWidth: 1,
  },
  meta: {
    color: palette.muted,
    marginBottom: spacing.xs,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  right: {
    marginRight: spacing.md,
  },
});

export default ResourceCard;
