import api from './api';
import { Event, EventPayload, EventSignup } from '@/types/api';
import { ENABLE_MOCKS } from '@/constants/env';
import { MOCK_EVENTS, MOCK_SIGNUPS } from '@/constants/mockData';

export const fetchEvents = async (): Promise<Event[]> => {
  if (ENABLE_MOCKS) return MOCK_EVENTS;
  const { data } = await api.get<Event[]>('/api/Events');
  return data;
};

export const fetchUpcomingEvents = async (): Promise<Event[]> => {
  if (ENABLE_MOCKS) return MOCK_EVENTS;
  const { data } = await api.get<Event[]>('/api/Events/upcoming');
  return data;
};

export const fetchEventById = async (id: string): Promise<Event | null> => {
  if (ENABLE_MOCKS) return MOCK_EVENTS.find((e) => e.id === id) ?? null;
  const { data } = await api.get<Event>(`/api/Events/${id}`);
  return data;
};

export const fetchEventsByDepartment = async (departmentId: string): Promise<Event[]> => {
  if (ENABLE_MOCKS) return MOCK_EVENTS.filter((e) => e.departmentId === departmentId);
  const { data } = await api.get<Event[]>(`/api/Events/department/${departmentId}`);
  return data;
};

export const createEvent = async (payload: EventPayload): Promise<Event> => {
  if (ENABLE_MOCKS) {
    const newEvent: Event = {
      id: `mock-${Date.now()}`,
      signupsCount: 0,
      department: undefined,
      ...payload,
    };
    return newEvent;
  }
  const { data } = await api.post<Event>('/api/Events', payload);
  return data;
};

export const updateEvent = async (id: string, payload: Partial<EventPayload>): Promise<Event> => {
  if (ENABLE_MOCKS) {
    const existing = MOCK_EVENTS.find((e) => e.id === id);
    return { ...(existing ?? { id, signupsCount: 0 }), ...payload } as Event;
  }
  const { data } = await api.put<Event>(`/api/Events/${id}`, payload);
  return data;
};

export const deleteEvent = async (id: string) => {
  if (ENABLE_MOCKS) return;
  await api.delete(`/api/Events/${id}`);
};

export const signupForEvent = async (eventId: string) => {
  if (ENABLE_MOCKS) return;
  await api.post(`/api/Events/${eventId}/signup`);
};

export const cancelEventSignup = async (eventId: string) => {
  if (ENABLE_MOCKS) return;
  await api.delete(`/api/Events/${eventId}/signup`);
};

export const fetchEventSignups = async (eventId: string): Promise<EventSignup[]> => {
  if (ENABLE_MOCKS) return MOCK_SIGNUPS.filter((s) => s.eventId === eventId);
  const { data } = await api.get<EventSignup[]>(`/api/Events/${eventId}/signups`);
  return data;
};
