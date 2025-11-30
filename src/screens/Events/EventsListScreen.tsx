import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, SegmentedButtons, Text } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Screen from '@/components/Screen';
import ResourceCard from '@/components/ResourceCard';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { fetchEvents, fetchUpcomingEvents } from '@/services/events';
import { Event } from '@/types/api';
import { spacing, palette } from '@/styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/hooks/useAuth';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const EventsListScreen = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'upcoming' | 'all'>('upcoming');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = filter === 'upcoming' ? await fetchUpcomingEvents() : await fetchEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          Events
        </Text>
        {user?.isAdmin ? (
          <Button mode="contained" onPress={() => navigation.navigate('EventForm', {})}>
            Create
          </Button>
        ) : null}
      </View>

      <SegmentedButtons
        value={filter}
        onValueChange={(value) => setFilter(value as 'upcoming' | 'all')}
        buttons={[
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'all', label: 'All' },
        ]}
        style={styles.segment}
      />

      {loading ? (
        <Text style={styles.helper}>Loading events...</Text>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : events.length === 0 ? (
        <EmptyState title="No events" message="Create an event or adjust filters." />
      ) : (
        events.map((event) => (
          <ResourceCard
            key={event.id}
            title={event.title}
            subtitle={new Date(event.dateTime).toLocaleString()}
            meta={`${event.location} • ${event.signupsCount} signups`}
            chips={event.department ? [event.department.name] : undefined}
            onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
          />
        ))
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  segment: {
    marginBottom: spacing.md,
  },
  helper: {
    color: palette.muted,
  },
});

export default EventsListScreen;
