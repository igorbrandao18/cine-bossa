import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <PaperProvider>
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
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
}); 