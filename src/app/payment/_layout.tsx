import { Stack } from 'expo-router';

export default function PaymentLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="add-card" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="select-card" 
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 