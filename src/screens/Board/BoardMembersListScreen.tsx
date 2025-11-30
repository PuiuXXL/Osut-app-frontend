import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Screen from '@/components/Screen';
import ResourceCard from '@/components/ResourceCard';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { fetchBoardMembers } from '@/services/boardMembers';
import { BoardMember } from '@/types/api';
import { spacing, palette } from '@/styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/hooks/useAuth';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const BoardMembersListScreen = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBoardMembers();
      setMembers(data);
    } catch (err) {
      setError('Unable to load board members');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          Board Members
        </Text>
        {user?.isAdmin ? (
          <Button mode="contained" onPress={() => navigation.navigate('BoardMemberForm', {})}>
            Assign
          </Button>
        ) : null}
      </View>

      {loading ? (
        <Text style={styles.helper}>Loading board members...</Text>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : members.length === 0 ? (
        <EmptyState title="No board members" message="Assign board roles to volunteers." />
      ) : (
        members.map((member) => (
          <ResourceCard
            key={member.id}
            title={member.user?.firstName ?? 'Member'}
            subtitle={member.user?.email}
            meta={member.position}
            onPress={() => navigation.navigate('BoardMemberDetail', { boardMemberId: member.id })}
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

export default BoardMembersListScreen;
