import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Chip, Divider, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Screen from '@/components/Screen';
import InfoRow from '@/components/InfoRow';
import ConfirmDialog from '@/components/ConfirmDialog';
import ErrorState from '@/components/ErrorState';
import { RootStackParamList } from '@/navigation/types';
import {
  cancelEventSignup,
  deleteEvent,
  fetchEventById,
  fetchEventSignups,
  signupForEvent,
} from '@/services/events';
import { Event, EventSignup } from '@/types/api';
import { spacing } from '@/styles/theme';
import { useAuth } from '@/hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

const EventDetailScreen = ({ route, navigation }: Props) => {
  const { eventId } = route.params;
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [signups, setSignups] = useState<EventSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [eventData, signupData] = await Promise.all([fetchEventById(eventId), fetchEventSignups(eventId)]);
      setEvent(eventData);
      setSignups(signupData);
    } catch (err) {
      setError('Unable to load event');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSignup = async () => {
    if (!event) return;
    try {
      await signupForEvent(event.id);
      await load();
    } catch {
      setError('Unable to sign up for this event');
    }
  };

  const handleCancelSignup = async () => {
    try {
      await cancelEventSignup(eventId);
      await load();
    } catch {
      setError('Unable to cancel signup');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEvent(eventId);
      navigation.goBack();
    } catch {
      setError('Failed to delete event');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const isSignedUp = Boolean(user && signups.some((signup) => signup.userId === user.id));

  if (loading) {
    return <Text style={styles.helper}>Loading event...</Text>;
  }

  if (error || !event) {
    return <ErrorState message={error ?? 'Event not found'} onRetry={load} />;
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text variant="titleLarge" style={styles.title}>
            {event.title}
          </Text>
          <Text style={styles.helper}>{event.department?.name}</Text>
        </View>
        {user?.isAdmin ? (
          <Button onPress={() => navigation.navigate('EventForm', { eventId })}>Edit</Button>
        ) : null}
      </View>

      <InfoRow label="When" value={new Date(event.dateTime).toLocaleString()} />
      <InfoRow label="Where" value={event.location} />
      <InfoRow label="Signups" value={`${event.signupsCount}`} />
      {event.description ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text>{event.description}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actions}>
          {isSignedUp ? (
            <Button mode="outlined" onPress={handleCancelSignup}>
              Cancel signup
            </Button>
          ) : (
            <Button mode="contained" onPress={handleSignup}>
              Sign up
            </Button>
          )}
          <Button
            mode="text"
            onPress={() => navigation.navigate('EventSignups', { eventId, title: event.title })}
          >
            View signups
          </Button>
        </View>
      </View>

      {user?.isAdmin ? (
        <>
          <Divider style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admin</Text>
            <View style={styles.actions}>
              <Button mode="contained-tonal" onPress={() => navigation.navigate('EventForm', { eventId })}>
                Edit event
              </Button>
              <Button mode="text" textColor="red" onPress={() => setShowConfirm(true)} disabled={deleting}>
                Delete event
              </Button>
            </View>
          </View>
        </>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendees</Text>
        {signups.length === 0 ? (
          <Text style={styles.helper}>No signups yet.</Text>
        ) : (
          <View style={styles.chips}>
            {signups.slice(0, 5).map((signup) => (
              <Chip key={signup.id} style={styles.chip}>
                {signup.user?.firstName ?? 'Volunteer'}
              </Chip>
            ))}
          </View>
        )}
      </View>

      <ConfirmDialog
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        description="This will remove the event and its signups."
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
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  divider: {
    marginVertical: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
});

export default EventDetailScreen;
