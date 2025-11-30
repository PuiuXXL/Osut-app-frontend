import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  EventDetail: { eventId: string };
  EventForm: { eventId?: string };
  EventSignups: { eventId: string; title?: string };
  DepartmentDetail: { departmentId: string };
  DepartmentForm: { departmentId?: string };
  BoardMemberDetail: { boardMemberId: string };
  BoardMemberForm: { boardMemberId?: string };
  UserDetail: { userId: string };
  UserForm: { userId: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Events: undefined;
  Departments: undefined;
  Board: undefined;
  Users: undefined;
  Profile: undefined;
};
