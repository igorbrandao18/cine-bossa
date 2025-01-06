import { Stack } from 'expo-router';

export default function PaymentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="add-card" 
        options={{
          title: 'Add Card'
        }}
      />
      <Stack.Screen 
        name="select-card" 
        options={{
          title: 'Select Card'
        }}
      />
      <Stack.Screen 
        name="pix/index"
        options={{
          title: 'PIX Payment'
        }}
      />
    </Stack>
  );
} 