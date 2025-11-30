import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Screen from '@/components/Screen';
import InfoRow from '@/components/InfoRow';
import { useAuth } from '@/hooks/useAuth';
import { spacing, palette } from '@/styles/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<Nav>();
  const { user, logout, refreshProfile, isLoading } = useAuth();

  if (!user) {
    return (
      <Screen>
        <Text>Unable to load your profile.</Text>
        <Button onPress={refreshProfile}>Retry</Button>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text variant="headlineSmall" style={styles.title}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.helper}>{user.email}</Text>
        </View>
        <Button mode="contained-tonal" onPress={() => navigation.navigate('UserForm', { userId: user.id })}>
          Edit
        </Button>
      </View>

      <InfoRow label="Status" value={user.status} />
      <InfoRow label="Year of birth" value={user.yearOfBirth ?? undefined} />
      <InfoRow label="Admin" value={user.isAdmin ? 'Yes' : 'No'} />

      <View style={styles.actions}>
        <Button mode="outlined" onPress={refreshProfile}>
          Refresh
        </Button>
        <Button mode="text" textColor="red" onPress={logout} loading={isLoading}>
          Logout
        </Button>
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
  title: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  helper: {
    color: '#FFFFFF',
  },
  actions: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
});

export default ProfileScreen;
