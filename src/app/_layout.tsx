import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
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
              backgroundColor: '#1a1a1a',
              borderTopColor: '#333',
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarActiveTintColor: '#E50914',
            tabBarInactiveTintColor: '#666',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Em Cartaz',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="movie-open" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explorar',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="compass" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="favorites"
            options={{
              title: 'Favoritos',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="heart" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="tickets"
            options={{
              title: 'Ingressos',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="ticket" size={size} color={color} />
              ),
              tabBarBadge: 3,
              tabBarBadgeStyle: {
                backgroundColor: '#E50914',
                color: '#fff',
              },
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

          <Tabs.Screen
            name="(stack)"
            options={{
              href: null,
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
  },
}); 