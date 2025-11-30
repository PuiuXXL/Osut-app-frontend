export type VolunteerStatus =
  | 'Recruit'
  | 'InactiveVolunteer'
  | 'Volunteer'
  | 'Member'
  | 'ActiveMember';

export type DepartmentType = 'Projects' | 'Services' | 'Directions';

export type BoardPosition =
  | 'President'
  | 'ExecutiveDirector'
  | 'GeneralSecretary'
  | 'VicePresidentElectronics'
  | 'VicePresidentConstruction'
  | 'VicePresidentMechanics'
  | 'VicePresidentInternalRelations'
  | 'VicePresidentExternalRelations'
  | 'PRDirector';

export const BOARD_POSITIONS: BoardPosition[] = [
  'President',
  'ExecutiveDirector',
  'GeneralSecretary',
  'VicePresidentElectronics',
  'VicePresidentConstruction',
  'VicePresidentMechanics',
  'VicePresidentInternalRelations',
  'VicePresidentExternalRelations',
  'PRDirector',
];

export const DEPARTMENT_TYPES: DepartmentType[] = ['Projects', 'Services', 'Directions'];

export const VOLUNTEER_STATUSES: VolunteerStatus[] = [
  'Recruit',
  'InactiveVolunteer',
  'Volunteer',
  'Member',
  'ActiveMember',
];

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  yearOfBirth?: number;
  profilePictureUrl?: string;
  status: VolunteerStatus;
  isAdmin: boolean;
  email?: string;
  userName?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  type: DepartmentType;
  coordinatorId: string;
  coordinator?: User;
  eventsCount: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  dateTime: string;
  location: string;
  departmentId: string;
  department?: Department;
  signupsCount: number;
}

export interface EventSignup {
  id: string;
  eventId: string;
  event?: Event;
  userId: string;
  user?: User;
  signupDate: string;
}

export interface BoardMember {
  id: string;
  userId: string;
  user?: User;
  position: BoardPosition;
  assignedDate: string;
}

export interface DepartmentPayload {
  name: string;
  description?: string;
  type: DepartmentType;
  coordinatorId: string;
}

export interface EventPayload {
  title: string;
  description?: string;
  dateTime: string;
  location: string;
  departmentId: string;
}

export interface BoardMemberPayload {
  userId: string;
  position: BoardPosition;
}

export interface UserUpdatePayload {
  id: string;
  firstName?: string;
  lastName?: string;
  yearOfBirth?: number;
  profilePictureUrl?: string;
  status?: VolunteerStatus;
  isAdmin?: boolean;
  email?: string;
  userName?: string;
}
