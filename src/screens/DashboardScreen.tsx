import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Screen from '@/components/Screen';
import ResourceCard from '@/components/ResourceCard';
import FullScreenLoader from '@/components/FullScreenLoader';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { fetchUpcomingEvents } from '@/services/events';
import { fetchDepartments } from '@/services/departments';
import { Department, Event } from '@/types/api';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { spacing, palette } from '@/styles/theme';
import { useAuth } from '@/hooks/useAuth';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DashboardScreen = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const [eventsData, deptData] = await Promise.all([fetchUpcomingEvents(), fetchDepartments()]);
      setUpcoming(eventsData.slice(0, 3));
      setDepartments(deptData);
    } catch (err) {
      setError('Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <FullScreenLoader message="Loading updates..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text variant="titleLarge" style={styles.greeting}>
            Welcome back
          </Text>
          <Text style={styles.subtitle}>Here is what&apos;s happening in OSUT</Text>
        </View>
        {user?.isAdmin ? (
          <Button mode="contained" onPress={() => navigation.navigate('EventForm', {})}>
            New event
          </Button>
        ) : null}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium">Upcoming events</Text>
          <Button onPress={() => navigation.navigate('MainTabs', { screen: 'Events' })}>See all</Button>
        </View>
        {upcoming.length === 0 ? (
          <EmptyState title="No events scheduled" message="Check back later or create a new event." />
        ) : (
          upcoming.map((event) => (
            <ResourceCard
              key={event.id}
              title={event.title}
              subtitle={new Date(event.dateTime).toLocaleString()}
              meta={`${event.location} • ${event.signupsCount} signups`}
              onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
              chips={event.department ? [event.department.name] : undefined}
            />
          ))
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium">Departments</Text>
          <Button onPress={() => navigation.navigate('DepartmentForm', {})}>New</Button>
        </View>
        {departments.length === 0 ? (
          <EmptyState title="No departments" message="Create a department to get started." />
        ) : (
          departments.slice(0, 3).map((dept) => (
            <ResourceCard
              key={dept.id}
              title={dept.name}
              subtitle={dept.description}
              meta={`${dept.type} • ${dept.eventsCount} events`}
              onPress={() => navigation.navigate('DepartmentDetail', { departmentId: dept.id })}
            />
          ))
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    color: palette.muted,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
});

export default DashboardScreen;
