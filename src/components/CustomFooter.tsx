import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const TABS = [
  {
    name: 'home',
    label: 'Home',
    icon: 'movie-open',
    path: '/',
  },
  {
    name: 'explore',
    label: 'Explorar',
    icon: 'compass',
    path: '/explore',
  },
  {
    name: 'tickets',
    label: 'Ingressos',
    icon: 'ticket',
    path: '/@tickets',
  },
] as const;

export function CustomFooter() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.footer}>
      <View style={styles.content}>
        {TABS.map((tab) => {
          const isActive = pathname === tab.path || 
                          (pathname === '/' && tab.name === 'home');
          
          return (
            <Pressable
              key={tab.name}
              style={({ pressed }) => [
                styles.tab,
                pressed && styles.tabPressed
              ]}
              onPress={() => router.push(tab.path)}
            >
              <MaterialCommunityIcons
                name={tab.icon as any}
                size={24}
                color={isActive ? '#E50914' : '#666'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: 16,
  },
  content: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabPressed: {
    opacity: 0.7,
  },
  tabLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#E50914',
  },
}); 