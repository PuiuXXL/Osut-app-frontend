import { BoardMember, Department, Event, EventSignup, User } from '@/types/api';

export const MOCK_USER: User = {
  id: 'mock-user-1',
  firstName: 'Josan',
  lastName: 'Member',
  email: 'pula@osut.dev',
  status: 'Member',
  isAdmin: false,
  userName: 'josan.member',
  profilePictureUrl: undefined,
  yearOfBirth: 6969,
};

export const MOCK_USERS: User[] = [
  MOCK_USER,
  {
    id: 'mock-user-2',
    firstName: 'Mara',
    lastName: 'Member',
    email: 'mara@osut.dev',
    status: 'Member',
    isAdmin: false,
  },
];

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 'svc-imagine',
    name: 'Imagine',
    description: 'Creative and media services.',
    type: 'Services',
    coordinatorId: 'mock-user-2',
    coordinator: MOCK_USERS[1],
    eventsCount: 0,
  },
  {
    id: 'svc-tehnic-administrativ',
    name: 'Tehnic-Administrativ',
    description: 'Technical and administrative support.',
    type: 'Services',
    coordinatorId: 'mock-user-1',
    coordinator: MOCK_USER,
    eventsCount: 0,
  },
  {
    id: 'proj-viitor-inginer',
    name: 'Viitor Inginer',
    description: 'Engineering student development program.',
    type: 'Projects',
    coordinatorId: 'mock-user-1',
    coordinator: MOCK_USER,
    eventsCount: 0,
  },
  {
    id: 'proj-polihack',
    name: 'Polihack',
    description: 'Innovation and hackathon competition.',
    type: 'Projects',
    coordinatorId: 'mock-user-1',
    coordinator: MOCK_USER,
    eventsCount: 1,
  },
  {
    id: 'proj-esu',
    name: 'ESU',
    description: 'Student union representation projects.',
    type: 'Projects',
    coordinatorId: 'mock-user-2',
    coordinator: MOCK_USERS[1],
    eventsCount: 0,
  },
  {
    id: 'proj-infotech',
    name: 'Infotech',
    description: 'Technology and IT education initiatives.',
    type: 'Projects',
    coordinatorId: 'mock-user-1',
    coordinator: MOCK_USER,
    eventsCount: 0,
  },
  {
    id: 'proj-gala-aniversara',
    name: 'Gala Aniversara',
    description: 'Annual celebration gala.',
    type: 'Projects',
    coordinatorId: 'mock-user-2',
    coordinator: MOCK_USERS[1],
    eventsCount: 0,
  },
  {
    id: 'proj-balul-bobocilor',
    name: 'Balul Bobocilor',
    description: 'Freshers welcome ball.',
    type: 'Projects',
    coordinatorId: 'mock-user-1',
    coordinator: MOCK_USER,
    eventsCount: 0,
  },
  {
    id: 'dir-cultural',
    name: 'Cultural',
    description: 'Cultural direction initiatives.',
    type: 'Directions',
    coordinatorId: 'mock-user-2',
    coordinator: MOCK_USERS[1],
    eventsCount: 0,
  },
  {
    id: 'dir-divertisment',
    name: 'Divertisment',
    description: 'Entertainment and social activities.',
    type: 'Directions',
    coordinatorId: 'mock-user-1',
    coordinator: MOCK_USER,
    eventsCount: 0,
  },
  {
    id: 'dir-educational',
    name: 'Educațional',
    description: 'Educational programs and workshops.',
    type: 'Directions',
    coordinatorId: 'mock-user-2',
    coordinator: MOCK_USERS[1],
    eventsCount: 0,
  },
  {
    id: 'dir-sport-sanatate',
    name: 'Sport și sănătate',
    description: 'Sports and wellness initiatives.',
    type: 'Directions',
    coordinatorId: 'mock-user-1',
    coordinator: MOCK_USER,
    eventsCount: 0,
  },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'event-1',
    title: 'Community Cleanup',
    description: 'Help tidy the park.',
    dateTime: new Date().toISOString(),
    location: 'Central Park',
    departmentId: 'svc-imagine',
    department: MOCK_DEPARTMENTS[0],
    signupsCount: 3,
  },
  {
    id: 'event-2',
    title: 'Polihack Kickoff',
    description: 'Launch meetup for Polihack projects.',
    dateTime: new Date(Date.now() + 86400000).toISOString(),
    location: 'Makerspace',
    departmentId: 'proj-polihack',
    department: MOCK_DEPARTMENTS[3],
    signupsCount: 5,
  },
];

export const MOCK_SIGNUPS: EventSignup[] = [
  {
    id: 'signup-1',
    eventId: 'event-1',
    userId: 'mock-user-1',
    signupDate: new Date().toISOString(),
    user: MOCK_USER,
    event: MOCK_EVENTS[0],
  },
  {
    id: 'signup-2',
    eventId: 'event-2',
    userId: 'mock-user-2',
    signupDate: new Date().toISOString(),
    user: MOCK_USERS[1],
    event: MOCK_EVENTS[1],
  },
];

export const MOCK_BOARD: BoardMember[] = [
  {
    id: 'board-1',
    userId: 'mock-user-1',
    user: MOCK_USER,
    position: 'President',
    assignedDate: new Date().toISOString(),
  },
];
