import { Stack, Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <PaperProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#000',
              borderTopColor: '#333',
              height: Platform.OS === 'ios' ? 90 : 70,
              paddingBottom: Platform.OS === 'ios' ? 30 : 10,
              paddingTop: 10,
            },
            tabBarActiveTintColor: '#E50914',
            tabBarInactiveTintColor: '#666',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Início',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="movie-open" size={size} color={color} />
              ),
            }}
          />
          
          <Tabs.Screen
            name="(stack)"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              title: 'Perfil',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
}); 