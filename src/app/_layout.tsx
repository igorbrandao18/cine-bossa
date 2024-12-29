import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { theme } from '../theme';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="light" translucent />
      <Stack screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#000' }
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen 
          name="movie/[id]" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }} 
        />
        <Stack.Screen name="sessions/[movieId]" />
        <Stack.Screen name="seats/[sessionId]" />
      </Stack>
    </PaperProvider>
  );
} 