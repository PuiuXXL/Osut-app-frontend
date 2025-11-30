import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, SegmentedButtons, Text } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Screen from '@/components/Screen';
import ResourceCard from '@/components/ResourceCard';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { fetchDepartments, fetchDepartmentsByType } from '@/services/departments';
import { Department, DepartmentType, DEPARTMENT_TYPES } from '@/types/api';
import { spacing, palette } from '@/styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/hooks/useAuth';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DepartmentsListScreen = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filter, setFilter] = useState<DepartmentType | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data =
        filter === 'all' ? await fetchDepartments() : await fetchDepartmentsByType(filter as DepartmentType);
      setDepartments(data);
    } catch (err) {
      setError('Failed to load departments');
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
          Departments
        </Text>
        {user?.isAdmin ? (
          <Button mode="contained" onPress={() => navigation.navigate('DepartmentForm', {})}>
            Add
          </Button>
        ) : null}
      </View>

      <SegmentedButtons
        value={filter}
        onValueChange={(value) => setFilter(value as DepartmentType | 'all')}
        buttons={[{ value: 'all', label: 'All' }, ...DEPARTMENT_TYPES.map((type) => ({ value: type, label: type }))]}
        style={styles.segment}
      />

      {loading ? (
        <Text style={styles.helper}>Loading departments...</Text>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : departments.length === 0 ? (
        <EmptyState title="No departments" message="Create a department to start grouping events." />
      ) : (
        departments.map((department) => (
          <ResourceCard
            key={department.id}
            title={department.name}
            subtitle={department.description}
            meta={`${department.type} • ${department.eventsCount} events`}
            onPress={() => navigation.navigate('DepartmentDetail', { departmentId: department.id })}
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

export default DepartmentsListScreen;
