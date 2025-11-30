import api from './api';
import { User, UserUpdatePayload } from '@/types/api';
import { ENABLE_MOCKS } from '@/constants/env';
import { MOCK_USER, MOCK_USERS } from '@/constants/mockData';

export const fetchUsers = async (): Promise<User[]> => {
  if (ENABLE_MOCKS) return MOCK_USERS;
  const { data } = await api.get<User[]>('/api/Users');
  return data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  if (ENABLE_MOCKS) {
    const user = MOCK_USERS.find((u) => u.id === id) ?? MOCK_USER;
    return user;
  }
  const { data } = await api.get<User>(`/api/Users/${id}`);
  return data;
};

export const updateUser = async (id: string, payload: UserUpdatePayload) => {
  if (ENABLE_MOCKS) return;
  await api.put(`/api/Users/${id}`, payload);
};

export const deleteUser = async (id: string) => {
  if (ENABLE_MOCKS) return;
  await api.delete(`/api/Users/${id}`);
};
