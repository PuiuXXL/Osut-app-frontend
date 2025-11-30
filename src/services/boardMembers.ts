import api from './api';
import { BoardMember, BoardMemberPayload, BoardPosition } from '@/types/api';
import { ENABLE_MOCKS } from '@/constants/env';
import { MOCK_BOARD } from '@/constants/mockData';

export const fetchBoardMembers = async (): Promise<BoardMember[]> => {
  if (ENABLE_MOCKS) return MOCK_BOARD;
  const { data } = await api.get<BoardMember[]>('/api/BoardMembers');
  return data;
};

export const fetchBoardMemberById = async (id: string): Promise<BoardMember> => {
  if (ENABLE_MOCKS) {
    const member = MOCK_BOARD.find((b) => b.id === id);
    if (!member) throw new Error('Not found');
    return member;
  }
  const { data } = await api.get<BoardMember>(`/api/BoardMembers/${id}`);
  return data;
};

export const fetchBoardMemberByPosition = async (position: BoardPosition): Promise<BoardMember> => {
  if (ENABLE_MOCKS) {
    const member = MOCK_BOARD.find((b) => b.position === position);
    if (!member) throw new Error('Not found');
    return member;
  }
  const { data } = await api.get<BoardMember>(`/api/BoardMembers/position/${position}`);
  return data;
};

export const fetchBoardMemberByUser = async (userId: string): Promise<BoardMember> => {
  if (ENABLE_MOCKS) {
    const member = MOCK_BOARD.find((b) => b.userId === userId);
    if (!member) throw new Error('Not found');
    return member;
  }
  const { data } = await api.get<BoardMember>(`/api/BoardMembers/user/${userId}`);
  return data;
};

export const assignBoardMember = async (payload: BoardMemberPayload): Promise<BoardMember> => {
  if (ENABLE_MOCKS) {
    const member: BoardMember = {
      id: `mock-${Date.now()}`,
      assignedDate: new Date().toISOString(),
      ...payload,
    };
    return member;
  }
  const { data } = await api.post<BoardMember>('/api/BoardMembers', payload);
  return data;
};

export const updateBoardMember = async (
  id: string,
  payload: Partial<BoardMemberPayload>,
): Promise<BoardMember> => {
  if (ENABLE_MOCKS) {
    const existing = MOCK_BOARD.find((b) => b.id === id);
    return { ...(existing ?? { id }), ...payload, assignedDate: existing?.assignedDate ?? new Date().toISOString() };
  }
  const { data } = await api.put<BoardMember>(`/api/BoardMembers/${id}`, payload);
  return data;
};

export const deleteBoardMember = async (id: string) => {
  if (ENABLE_MOCKS) return;
  await api.delete(`/api/BoardMembers/${id}`);
};
