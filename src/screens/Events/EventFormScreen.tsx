import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Menu, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Screen from '@/components/Screen';
import { createEvent, fetchEventById, updateEvent } from '@/services/events';
import { fetchDepartments } from '@/services/departments';
import { Department, EventPayload } from '@/types/api';
import { spacing } from '@/styles/theme';
import ErrorState from '@/components/ErrorState';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EventForm'>;

const EventFormScreen = ({ route, navigation }: Props) => {
  const isEditing = Boolean(route.params?.eventId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState(new Date().toISOString());
  const [location, setLocation] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departmentMenu, setDepartmentMenu] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const deptData = await fetchDepartments();
        setDepartments(deptData);
        if (isEditing && route.params?.eventId) {
          const existing = await fetchEventById(route.params.eventId);
          if (existing) {
            setTitle(existing.title);
            setDescription(existing.description ?? '');
            setDateTime(existing.dateTime);
            setLocation(existing.location);
            setDepartmentId(existing.departmentId);
          }
        }
      } catch (err) {
        setError('Unable to load form data');
      }
    };
    load();
  }, [isEditing, route.params?.eventId]);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    const payload: EventPayload = {
      title,
      description,
      dateTime,
      location,
      departmentId,
    };
    try {
      if (isEditing && route.params?.eventId) {
        const updated = await updateEvent(route.params.eventId, payload);
        navigation.replace('EventDetail', { eventId: updated.id });
      } else {
        const created = await createEvent(payload);
        navigation.replace('EventDetail', { eventId: created.id });
      }
    } catch (err) {
      setError('Failed to save event. Check required fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error && departments.length === 0) {
    return <ErrorState message={error} />;
  }

  return (
    <Screen>
      <View style={styles.form}>
        <TextInput label="Title" value={title} onChangeText={setTitle} mode="outlined" />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
        />
        <TextInput
          label="Date and time (ISO)"
          value={dateTime}
          onChangeText={setDateTime}
          mode="outlined"
          right={<TextInput.Icon icon="clock-outline" onPress={() => setDateTime(new Date().toISOString())} />}
        />
        <HelperText type="info">Use ISO date format (e.g., 2025-03-10T18:00:00Z)</HelperText>
        <TextInput label="Location" value={location} onChangeText={setLocation} mode="outlined" />

        <Menu
          visible={departmentMenu}
          onDismiss={() => setDepartmentMenu(false)}
          anchor={
            <TextInput
              label="Department"
              value={departments.find((d) => d.id === departmentId)?.name ?? ''}
              mode="outlined"
              editable={false}
              onPressIn={() => setDepartmentMenu(true)}
              right={<TextInput.Icon icon="chevron-down" onPress={() => setDepartmentMenu(true)} />}
            />
          }
        >
          {departments.map((dept) => (
            <Menu.Item
              key={dept.id}
              onPress={() => {
                setDepartmentId(dept.id);
                setDepartmentMenu(false);
              }}
              title={dept.name}
            />
          ))}
        </Menu>

        <Button mode="contained" onPress={onSubmit} loading={loading} disabled={loading || !title || !departmentId}>
          {isEditing ? 'Update event' : 'Create event'}
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

export default EventFormScreen;
