import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Screen from '@/components/Screen';
import InfoRow from '@/components/InfoRow';
import ConfirmDialog from '@/components/ConfirmDialog';
import ErrorState from '@/components/ErrorState';
import { RootStackParamList } from '@/navigation/types';
import { deleteBoardMember, fetchBoardMemberById } from '@/services/boardMembers';
import { BoardMember } from '@/types/api';
import { spacing } from '@/styles/theme';
import { useAuth } from '@/hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'BoardMemberDetail'>;

const BoardMemberDetailScreen = ({ route, navigation }: Props) => {
  const { boardMemberId } = route.params;
  const { user } = useAuth();
  const [member, setMember] = useState<BoardMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBoardMemberById(boardMemberId);
      setMember(data);
    } catch (err) {
      setError('Unable to load board member');
    } finally {
      setLoading(false);
    }
  }, [boardMemberId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBoardMember(boardMemberId);
      navigation.goBack();
    } catch {
      setError('Failed to remove board member');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return <Text style={styles.helper}>Loading...</Text>;
  }

  if (error || !member) {
    return <ErrorState message={error ?? 'Board member not found'} onRetry={load} />;
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text variant="titleLarge" style={styles.title}>
            {member.user?.firstName ?? 'Board member'}
          </Text>
          <Text style={styles.helper}>{member.user?.email}</Text>
        </View>
        {user?.isAdmin ? (
          <Button onPress={() => navigation.navigate('BoardMemberForm', { boardMemberId })}>Edit</Button>
        ) : null}
      </View>

      <InfoRow label="Position" value={member.position} />
      <InfoRow label="Assigned" value={new Date(member.assignedDate).toLocaleDateString()} />

      {user?.isAdmin ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin</Text>
          <View style={styles.actions}>
            <Button mode="contained-tonal" onPress={() => navigation.navigate('BoardMemberForm', { boardMemberId })}>
              Update position
            </Button>
            <Button mode="text" textColor="red" onPress={() => setShowConfirm(true)} disabled={deleting}>
              Remove
            </Button>
          </View>
        </View>
      ) : null}

      <ConfirmDialog
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        confirmLabel={deleting ? 'Removing...' : 'Remove'}
        description="Removing this member will free the board position."
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

export default BoardMemberDetailScreen;
