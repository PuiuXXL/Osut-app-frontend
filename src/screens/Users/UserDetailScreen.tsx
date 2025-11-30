import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Screen from '@/components/Screen';
import InfoRow from '@/components/InfoRow';
import ConfirmDialog from '@/components/ConfirmDialog';
import ErrorState from '@/components/ErrorState';
import { RootStackParamList } from '@/navigation/types';
import { deleteUser, fetchUserById } from '@/services/users';
import { User } from '@/types/api';
import { spacing } from '@/styles/theme';
import { useAuth } from '@/hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'UserDetail'>;

const UserDetailScreen = ({ route, navigation }: Props) => {
  const { userId } = route.params;
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserById(userId);
      setUser(data);
    } catch (err) {
      setError('Unable to load user');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const canManage = currentUser?.isAdmin || currentUser?.id === userId;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(userId);
      navigation.goBack();
    } catch {
      setError('Failed to delete user');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return <Text style={styles.helper}>Loading user...</Text>;
  }

  if (error || !user) {
    return <ErrorState message={error ?? 'User not found'} onRetry={load} />;
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text variant="titleLarge" style={styles.title}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.helper}>{user.email}</Text>
        </View>
        {canManage ? (
          <Button onPress={() => navigation.navigate('UserForm', { userId })}>Edit</Button>
        ) : null}
      </View>

      <InfoRow label="Status" value={user.status} />
      <InfoRow label="Year of birth" value={user.yearOfBirth ?? undefined} />
      <InfoRow label="Username" value={user.userName} />
      <InfoRow label="Admin" value={user.isAdmin ? 'Yes' : 'No'} />

      {canManage ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger zone</Text>
          <Button mode="text" textColor="red" onPress={() => setShowConfirm(true)} disabled={deleting}>
            Delete user
          </Button>
        </View>
      ) : null}

      <ConfirmDialog
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        description="This action cannot be undone."
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
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
});

export default UserDetailScreen;
