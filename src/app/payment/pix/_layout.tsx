import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack.Screen
        options={{
          title: '',
          headerShown: false,
          statusBarTranslucent: true,
          statusBarStyle: 'light',
          animation: 'slide_from_right',
        }}
      />
    </>
  );
} 