import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function StackLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              padding: 8,
              marginLeft: 8,
            })}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="movie/[id]"
        options={{
          title: 'Detalhes do Filme',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="sessions/[movieId]"
        options={{
          title: 'Sessões',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="seats/[sessionId]"
        options={{
          title: 'Escolha de Assentos',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          title: 'Finalizar Compra',
          headerShown: true,
        }}
      />
    </Stack>
  );
} 