import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, SegmentedButtons, Switch, Text, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Screen from '@/components/Screen';
import { fetchUserById, updateUser } from '@/services/users';
import { User, VolunteerStatus, VOLUNTEER_STATUSES } from '@/types/api';
import { spacing } from '@/styles/theme';
import ErrorState from '@/components/ErrorState';
import { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'UserForm'>;

const UserFormScreen = ({ route, navigation }: Props) => {
  const { userId } = route.params;
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [yearOfBirth, setYearOfBirth] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [status, setStatus] = useState<VolunteerStatus>('Recruit');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManage = currentUser?.isAdmin || currentUser?.id === userId;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUserById(userId);
        setUser(data);
        setFirstName(data.firstName ?? '');
        setLastName(data.lastName ?? '');
        setYearOfBirth(data.yearOfBirth?.toString() ?? '');
        setProfilePictureUrl(data.profilePictureUrl ?? '');
        setStatus(data.status);
        setIsAdmin(data.isAdmin);
      } catch (err) {
        setError('Unable to load user');
      }
    };
    load();
  }, [userId]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateUser(userId, {
        id: userId,
        firstName,
        lastName,
        yearOfBirth: yearOfBirth ? Number(yearOfBirth) : undefined,
        profilePictureUrl,
        status,
        isAdmin,
        email: user?.email,
        userName: user?.userName,
      });
      navigation.goBack();
    } catch (err) {
      setError('Failed to save user. Only admins or the account owner can edit.');
    } finally {
      setLoading(false);
    }
  };

  if (!canManage) {
    return (
      <Screen>
        <Text>You do not have permission to edit this user.</Text>
      </Screen>
    );
  }

  if (error && !user) {
    return <ErrorState message={error} />;
  }

  return (
    <Screen>
      <View style={styles.form}>
        <TextInput label="First name" value={firstName} onChangeText={setFirstName} mode="outlined" />
        <TextInput label="Last name" value={lastName} onChangeText={setLastName} mode="outlined" />
        <TextInput
          label="Year of birth"
          value={yearOfBirth}
          onChangeText={setYearOfBirth}
          keyboardType="numeric"
          mode="outlined"
        />
        <TextInput
          label="Profile picture URL"
          value={profilePictureUrl}
          onChangeText={setProfilePictureUrl}
          mode="outlined"
        />

        <SegmentedButtons
          value={status}
          onValueChange={(value) => setStatus(value as VolunteerStatus)}
          buttons={VOLUNTEER_STATUSES.map((value) => ({ value, label: value }))}
        />

        {currentUser?.isAdmin ? (
          <View style={styles.switchRow}>
            <Text>Admin</Text>
            <Switch value={isAdmin} onValueChange={setIsAdmin} />
          </View>
        ) : null}

        <Button mode="contained" onPress={handleSubmit} loading={loading}>
          Save
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default UserFormScreen;
