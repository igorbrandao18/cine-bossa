import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
              backgroundColor: '#000000',
              borderTopWidth: 0,
              height: 50,
              paddingBottom: 0,
              paddingTop: 0,
            },
            tabBarActiveTintColor: '#E50914',
            tabBarInactiveTintColor: '#666',
            tabBarLabelStyle: {
              fontSize: 10,
              marginBottom: 0,
            },
            tabBarIconStyle: {
              marginBottom: -4,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="movie-open" size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="tickets"
            options={{
              title: 'Ingressos',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="ticket" size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              title: 'Perfil',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" size={24} color={color} />
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
  },
}); 