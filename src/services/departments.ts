import api from './api';
import { Department, DepartmentPayload, DepartmentType } from '@/types/api';
import { ENABLE_MOCKS } from '@/constants/env';
import { MOCK_DEPARTMENTS } from '@/constants/mockData';

export const fetchDepartments = async (): Promise<Department[]> => {
  if (ENABLE_MOCKS) return MOCK_DEPARTMENTS;
  const { data } = await api.get<Department[]>('/api/Departments');
  return data;
};

export const fetchDepartmentById = async (id: string): Promise<Department> => {
  if (ENABLE_MOCKS) {
    const dept = MOCK_DEPARTMENTS.find((d) => d.id === id);
    if (!dept) throw new Error('Not found');
    return dept;
  }
  const { data } = await api.get<Department>(`/api/Departments/${id}`);
  return data;
};

export const fetchDepartmentsByType = async (type: DepartmentType): Promise<Department[]> => {
  if (ENABLE_MOCKS) return MOCK_DEPARTMENTS.filter((d) => d.type === type);
  const { data } = await api.get<Department[]>(`/api/Departments/type/${type}`);
  return data;
};

export const createDepartment = async (payload: DepartmentPayload): Promise<Department> => {
  if (ENABLE_MOCKS) {
    const dept: Department = {
      id: `mock-${Date.now()}`,
      eventsCount: 0,
      coordinator: undefined,
      ...payload,
    };
    return dept;
  }
  const { data } = await api.post<Department>('/api/Departments', payload);
  return data;
};

export const updateDepartment = async (
  id: string,
  payload: Partial<DepartmentPayload>,
): Promise<Department> => {
  if (ENABLE_MOCKS) {
    const existing = MOCK_DEPARTMENTS.find((d) => d.id === id);
    return { ...(existing ?? { id, eventsCount: 0 }), ...payload } as Department;
  }
  const { data } = await api.put<Department>(`/api/Departments/${id}`, payload);
  return data;
};

export const deleteDepartment = async (id: string) => {
  if (ENABLE_MOCKS) return;
  await api.delete(`/api/Departments/${id}`);
};
