import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from '@/navigation/RootNavigator';
import { AuthProvider } from '@/context/AuthContext';
import { navigationTheme, paperTheme } from '@/styles/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <AuthProvider>
            <NavigationContainer theme={navigationTheme}>
              <RootNavigator />
              <StatusBar style="dark" />
            </NavigationContainer>
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
