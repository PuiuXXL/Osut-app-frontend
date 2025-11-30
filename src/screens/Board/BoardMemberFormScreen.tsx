import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Menu, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Screen from '@/components/Screen';
import { assignBoardMember, fetchBoardMemberById, updateBoardMember } from '@/services/boardMembers';
import { fetchUsers } from '@/services/users';
import { BoardMember, BoardMemberPayload, BoardPosition, BOARD_POSITIONS, User } from '@/types/api';
import { spacing } from '@/styles/theme';
import ErrorState from '@/components/ErrorState';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BoardMemberForm'>;

const BoardMemberFormScreen = ({ route, navigation }: Props) => {
  const isEditing = Boolean(route.params?.boardMemberId);
  const [member, setMember] = useState<BoardMember | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState('');
  const [position, setPosition] = useState<BoardPosition>('President');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userMenu, setUserMenu] = useState(false);
  const [positionMenu, setPositionMenu] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [userData, existing] = await Promise.all([
          fetchUsers(),
          isEditing && route.params?.boardMemberId ? fetchBoardMemberById(route.params.boardMemberId) : null,
        ]);
        setUsers(userData);
        if (existing) {
          setMember(existing);
          setUserId(existing.userId);
          setPosition(existing.position);
        }
      } catch (err) {
        setError('Unable to load board member');
      }
    };
    load();
  }, [isEditing, route.params?.boardMemberId]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const payload: BoardMemberPayload = { userId, position };
    try {
      if (isEditing && route.params?.boardMemberId) {
        const updated = await updateBoardMember(route.params.boardMemberId, payload);
        navigation.replace('BoardMemberDetail', { boardMemberId: updated.id });
      } else {
        const created = await assignBoardMember(payload);
        navigation.replace('BoardMemberDetail', { boardMemberId: created.id });
      }
    } catch (err) {
      setError('Failed to save board role. Ensure the position and user are available.');
    } finally {
      setLoading(false);
    }
  };

  if (error && !member && users.length === 0) {
    return <ErrorState message={error} />;
  }

  return (
    <Screen>
      <View style={styles.form}>
        <Menu
          visible={userMenu}
          onDismiss={() => setUserMenu(false)}
          anchor={
            <TextInput
              label="Volunteer"
              value={users.find((u) => u.id === userId)?.firstName ?? ''}
              mode="outlined"
              editable={false}
              onPressIn={() => setUserMenu(true)}
              right={<TextInput.Icon icon="chevron-down" onPress={() => setUserMenu(true)} />}
            />
          }
        >
          {users.map((u) => (
            <Menu.Item
              key={u.id}
              onPress={() => {
                setUserId(u.id);
                setUserMenu(false);
              }}
              title={`${u.firstName ?? 'User'} ${u.lastName ?? ''}`.trim()}
            />
          ))}
        </Menu>

        <Menu
          visible={positionMenu}
          onDismiss={() => setPositionMenu(false)}
          anchor={
            <TextInput
              label="Position"
              value={position}
              mode="outlined"
              editable={false}
              onPressIn={() => setPositionMenu(true)}
              right={<TextInput.Icon icon="chevron-down" onPress={() => setPositionMenu(true)} />}
            />
          }
        >
          {BOARD_POSITIONS.map((pos) => (
            <Menu.Item
              key={pos}
              onPress={() => {
                setPosition(pos);
                setPositionMenu(false);
              }}
              title={pos}
            />
          ))}
        </Menu>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading || !userId || !position}
        >
          {isEditing ? 'Update board member' : 'Assign board member'}
        </Button>
        {error ? <HelperText type="error">{error}</HelperText> : null}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: spacing.sm,
  },
});

export default BoardMemberFormScreen;
