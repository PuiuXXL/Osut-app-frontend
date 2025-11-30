import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Menu, SegmentedButtons, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Screen from '@/components/Screen';
import { createDepartment, fetchDepartmentById, updateDepartment } from '@/services/departments';
import { fetchUsers } from '@/services/users';
import { Department, DepartmentPayload, DepartmentType, DEPARTMENT_TYPES, User } from '@/types/api';
import { spacing } from '@/styles/theme';
import ErrorState from '@/components/ErrorState';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DepartmentForm'>;

const DepartmentFormScreen = ({ route, navigation }: Props) => {
  const isEditing = Boolean(route.params?.departmentId);
  const [department, setDepartment] = useState<Department | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<DepartmentType>('Projects');
  const [coordinatorId, setCoordinatorId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coordinatorMenu, setCoordinatorMenu] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [userData, deptData] = await Promise.all([
          fetchUsers(),
          isEditing && route.params?.departmentId ? fetchDepartmentById(route.params.departmentId) : null,
        ]);
        setUsers(userData);
        if (deptData) {
          setDepartment(deptData);
          setName(deptData.name);
          setDescription(deptData.description ?? '');
          setType(deptData.type);
          setCoordinatorId(deptData.coordinatorId);
        }
      } catch (err) {
        setError('Unable to load form data');
      }
    };
    load();
  }, [isEditing, route.params?.departmentId]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const payload: DepartmentPayload = {
      name,
      description,
      type,
      coordinatorId,
    };
    try {
      if (isEditing && route.params?.departmentId) {
        const updated = await updateDepartment(route.params.departmentId, payload);
        navigation.replace('DepartmentDetail', { departmentId: updated.id });
      } else {
        const created = await createDepartment(payload);
        navigation.replace('DepartmentDetail', { departmentId: created.id });
      }
    } catch (err) {
      setError('Failed to save department. Only admins can create or edit departments.');
    } finally {
      setLoading(false);
    }
  };

  if (error && !department && users.length === 0) {
    return <ErrorState message={error} />;
  }

  return (
    <Screen>
      <View style={styles.form}>
        <TextInput label="Name" value={name} onChangeText={setName} mode="outlined" />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
        />

        <SegmentedButtons
          value={type}
          onValueChange={(value) => setType(value as DepartmentType)}
          buttons={DEPARTMENT_TYPES.map((value) => ({ value, label: value }))}
        />

        <Menu
          visible={coordinatorMenu}
          onDismiss={() => setCoordinatorMenu(false)}
          anchor={
            <TextInput
              label="Coordinator"
              value={users.find((u) => u.id === coordinatorId)?.firstName ?? ''}
              mode="outlined"
              editable={false}
              onPressIn={() => setCoordinatorMenu(true)}
              right={<TextInput.Icon icon="chevron-down" onPress={() => setCoordinatorMenu(true)} />}
            />
          }
        >
          {users.map((u) => (
            <Menu.Item
              key={u.id}
              onPress={() => {
                setCoordinatorId(u.id);
                setCoordinatorMenu(false);
              }}
              title={`${u.firstName ?? 'User'} ${u.lastName ?? ''}`.trim()}
            />
          ))}
        </Menu>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading || !name || !coordinatorId}
        >
          {isEditing ? 'Update department' : 'Create department'}
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

export default DepartmentFormScreen;
