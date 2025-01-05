import { Stack } from 'expo-router';

export default function PixLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index"
        options={{
          title: '',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 