import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
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
          name="sessions/[movieId]"
          options={{
            title: 'Sessões',
            headerTransparent: true,
            headerBlurEffect: 'dark',
          }}
        />
        <Stack.Screen
          name="seats/[sessionId]"
          options={{
            title: 'Escolha seus assentos',
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            title: 'Finalizar Compra',
            headerBackTitle: 'Voltar',
          }}
        />
      </Stack>
    </>
  );
} 