import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import DashboardScreen from '@/screens/DashboardScreen';
import EventsListScreen from '@/screens/Events/EventsListScreen';
import DepartmentsListScreen from '@/screens/Departments/DepartmentsListScreen';
import BoardMembersListScreen from '@/screens/Board/BoardMembersListScreen';
import UsersListScreen from '@/screens/Users/UsersListScreen';
import ProfileScreen from '@/screens/Profile/ProfileScreen';
import { palette } from '@/styles/theme';
import { useAuth } from '@/hooks/useAuth';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsListScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="calendar-star" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Departments"
        component={DepartmentsListScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="office-building" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Board"
        component={BoardMembersListScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-group" size={size} color={color} />,
        }}
      />
      {user?.isAdmin ? (
        <Tab.Screen
          name="Users"
          component={UsersListScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-multiple" size={size} color={color} />
            ),
          }}
        />
      ) : null}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
