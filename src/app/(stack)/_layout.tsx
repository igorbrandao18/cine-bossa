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
          href: null,
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="movie/[id]"
        options={{
          href: null,
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="sessions/[movieId]"
        options={{
          href: null,
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="seats/[sessionId]"
        options={{
          href: null,
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="checkout"
        options={{
          href: null,
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="success"
        options={{
          href: null,
          headerShown: false
        }}
      />
    </Stack>
  );
} 