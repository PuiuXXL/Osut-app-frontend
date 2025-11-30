import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Screen from '@/components/Screen';
import InfoRow from '@/components/InfoRow';
import ResourceCard from '@/components/ResourceCard';
import ConfirmDialog from '@/components/ConfirmDialog';
import ErrorState from '@/components/ErrorState';
import { RootStackParamList } from '@/navigation/types';
import { deleteDepartment, fetchDepartmentById } from '@/services/departments';
import { fetchEventsByDepartment } from '@/services/events';
import { Department, Event } from '@/types/api';
import { spacing } from '@/styles/theme';
import { useAuth } from '@/hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'DepartmentDetail'>;

const DepartmentDetailScreen = ({ route, navigation }: Props) => {
  const { departmentId } = route.params;
  const { user } = useAuth();
  const [department, setDepartment] = useState<Department | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [deptData, deptEvents] = await Promise.all([
        fetchDepartmentById(departmentId),
        fetchEventsByDepartment(departmentId),
      ]);
      setDepartment(deptData);
      setEvents(deptEvents);
    } catch (err) {
      setError('Unable to load department');
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDepartment(departmentId);
      navigation.goBack();
    } catch {
      setError('Failed to delete department');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return <Text style={styles.helper}>Loading department...</Text>;
  }

  if (error || !department) {
    return <ErrorState message={error ?? 'Department not found'} onRetry={load} />;
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text variant="titleLarge" style={styles.title}>
            {department.name}
          </Text>
          <Text style={styles.helper}>{department.type}</Text>
        </View>
        {user?.isAdmin ? (
          <Button onPress={() => navigation.navigate('DepartmentForm', { departmentId })}>Edit</Button>
        ) : null}
      </View>

      {department.description ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text>{department.description}</Text>
        </View>
      ) : null}

      <InfoRow label="Coordinator" value={department.coordinator?.firstName ?? department.coordinatorId} />
      <InfoRow label="Events" value={`${department.eventsCount}`} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Events</Text>
        {events.length === 0 ? (
          <Text style={styles.helper}>No events in this department yet.</Text>
        ) : (
          events.map((event) => (
            <ResourceCard
              key={event.id}
              title={event.title}
              subtitle={new Date(event.dateTime).toLocaleString()}
              meta={event.location}
              onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
            />
          ))
        )}
      </View>

      {user?.isAdmin ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin</Text>
          <View style={styles.actions}>
            <Button mode="contained-tonal" onPress={() => navigation.navigate('DepartmentForm', { departmentId })}>
              Edit department
            </Button>
            <Button mode="text" textColor="red" onPress={() => setShowConfirm(true)} disabled={deleting}>
              Delete department
            </Button>
          </View>
        </View>
      ) : null}

      <ConfirmDialog
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        description="Deleting a department will also remove its scheduled events."
      />
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
  },
  helper: {
    color: '#6B7280',
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});

export default DepartmentDetailScreen;
