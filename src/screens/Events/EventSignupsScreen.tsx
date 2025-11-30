import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Avatar, List, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Screen from '@/components/Screen';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { fetchEventSignups } from '@/services/events';
import { EventSignup } from '@/types/api';
import { RootStackParamList } from '@/navigation/types';
import { spacing } from '@/styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EventSignups'>;

const EventSignupsScreen = ({ route }: Props) => {
  const { eventId, title } = route.params;
  const [signups, setSignups] = useState<EventSignup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEventSignups(eventId);
      setSignups(data);
    } catch {
      setError('Unable to load signups');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <Text style={styles.helper}>Loading signups...</Text>;
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <Screen scrollable={false}>
      <Text variant="titleLarge" style={styles.title}>
        {title ?? 'Event signups'}
      </Text>
      {signups.length === 0 ? (
        <EmptyState title="No signups yet" />
      ) : (
        <FlatList
          data={signups}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <List.Item
              title={`${item.user?.firstName ?? 'Unknown'} ${item.user?.lastName ?? ''}`}
              description={new Date(item.signupDate).toLocaleString()}
              left={() => (
                <Avatar.Text
                  label={(item.user?.firstName?.[0] ?? 'V') + (item.user?.lastName?.[0] ?? '')}
                  size={40}
                />
              )}
            />
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: spacing.md,
  },
  helper: {
    padding: spacing.lg,
    color: '#6B7280',
  },
});

export default EventSignupsScreen;
