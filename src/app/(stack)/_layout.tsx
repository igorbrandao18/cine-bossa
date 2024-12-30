import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function StackLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#000',
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="movie/[id]"
          options={{
            title: 'Detalhes do Filme',
            headerTransparent: true,
            headerBlurEffect: 'dark',
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
}); 