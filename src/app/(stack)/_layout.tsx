import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000' },
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="movie/[id]"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card'
        }}
      />
      <Stack.Screen 
        name="sessions/[movieId]"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card'
        }}
      />
      <Stack.Screen 
        name="seats/[sessionId]"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card'
        }}
      />
      <Stack.Screen 
        name="payment"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card'
        }}
      />
      <Stack.Screen 
        name="success"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card'
        }}
      />
    </Stack>
  );
} 