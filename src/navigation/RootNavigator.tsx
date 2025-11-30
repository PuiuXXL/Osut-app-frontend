import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuth } from '@/hooks/useAuth';
import FullScreenLoader from '@/components/FullScreenLoader';
import LoginScreen from '@/screens/Auth/LoginScreen';
import MainTabs from './MainTabs';
import EventDetailScreen from '@/screens/Events/EventDetailScreen';
import EventFormScreen from '@/screens/Events/EventFormScreen';
import DepartmentDetailScreen from '@/screens/Departments/DepartmentDetailScreen';
import DepartmentFormScreen from '@/screens/Departments/DepartmentFormScreen';
import BoardMemberDetailScreen from '@/screens/Board/BoardMemberDetailScreen';
import BoardMemberFormScreen from '@/screens/Board/BoardMemberFormScreen';
import UserDetailScreen from '@/screens/Users/UserDetailScreen';
import UserFormScreen from '@/screens/Users/UserFormScreen';
import EventSignupsScreen from '@/screens/Events/EventSignupsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <FullScreenLoader message="Preparing OSUT mobile..." />;
  }

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: 'Event' }} />
          <Stack.Screen name="EventForm" component={EventFormScreen} options={{ title: 'Event form' }} />
          <Stack.Screen name="EventSignups" component={EventSignupsScreen} options={{ title: 'Signups' }} />
          <Stack.Screen
            name="DepartmentDetail"
            component={DepartmentDetailScreen}
            options={{ title: 'Department' }}
          />
          <Stack.Screen
            name="DepartmentForm"
            component={DepartmentFormScreen}
            options={{ title: 'Department form' }}
          />
          <Stack.Screen
            name="BoardMemberDetail"
            component={BoardMemberDetailScreen}
            options={{ title: 'Board member' }}
          />
          <Stack.Screen
            name="BoardMemberForm"
            component={BoardMemberFormScreen}
            options={{ title: 'Board role' }}
          />
          <Stack.Screen name="UserDetail" component={UserDetailScreen} options={{ title: 'User' }} />
          <Stack.Screen name="UserForm" component={UserFormScreen} options={{ title: 'Edit user' }} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
