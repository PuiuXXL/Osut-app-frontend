import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Screen from '@/components/Screen';
import ResourceCard from '@/components/ResourceCard';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { fetchUsers } from '@/services/users';
import { User } from '@/types/api';
import { spacing, palette } from '@/styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/hooks/useAuth';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const UsersListScreen = () => {
  const navigation = useNavigation<Nav>();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError('Unable to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (currentUser?.isAdmin) {
        load();
      }
    }, [currentUser?.isAdmin, load]),
  );

  if (!currentUser?.isAdmin) {
    return (
      <Screen>
        <Text>You need admin rights to view the user directory.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          Users
        </Text>
      </View>

      {loading ? (
        <Text style={styles.helper}>Loading users...</Text>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : users.length === 0 ? (
        <EmptyState title="No users" />
      ) : (
        users.map((user) => (
          <ResourceCard
            key={user.id}
            title={`${user.firstName ?? 'User'} ${user.lastName ?? ''}`.trim()}
            subtitle={user.email}
            meta={user.status}
            chips={user.isAdmin ? ['Admin'] : undefined}
            onPress={() => navigation.navigate('UserDetail', { userId: user.id })}
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
  helper: {
    color: palette.muted,
  },
});

export default UsersListScreen;
