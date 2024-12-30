import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text, Avatar, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useHistoryStore } from '../features/movies/stores/historyStore';
import { useFavoriteStore } from '../features/movies/stores/favoriteStore';
import { useTicketStore } from '../features/tickets/stores/ticketStore';

const MENU_ITEMS = [
  {
    id: 'history',
    title: 'Histórico',
    icon: 'history',
    description: 'Filmes assistidos e buscas recentes',
  },
  {
    id: 'favorites',
    title: 'Favoritos',
    icon: 'heart',
    description: 'Filmes salvos para assistir depois',
  },
  {
    id: 'tickets',
    title: 'Ingressos',
    icon: 'ticket',
    description: 'Seus ingressos ativos e histórico',
  },
  {
    id: 'notifications',
    title: 'Notificações',
    icon: 'bell',
    description: 'Preferências de notificação',
  },
  {
    id: 'payment',
    title: 'Pagamento',
    icon: 'credit-card',
    description: 'Métodos de pagamento e histórico',
  },
  {
    id: 'settings',
    title: 'Configurações',
    icon: 'cog',
    description: 'Preferências do aplicativo',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { watchHistory } = useHistoryStore();
  const { favorites } = useFavoriteStore();
  const { tickets } = useTicketStore();

  const stats = [
    {
      id: 'watched',
      title: 'Assistidos',
      value: watchHistory.length,
      icon: 'movie-check',
    },
    {
      id: 'favorites',
      title: 'Favoritos',
      value: favorites.length,
      icon: 'heart',
    },
    {
      id: 'tickets',
      title: 'Ingressos',
      value: tickets.length,
      icon: 'ticket',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <View style={styles.userSection}>
        <Avatar.Image
          size={80}
          source={{ uri: 'https://i.pravatar.cc/300' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>João Silva</Text>
        <Text style={styles.userEmail}>joao.silva@email.com</Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat) => (
          <View key={stat.id} style={styles.statItem}>
            <MaterialCommunityIcons
              name={stat.icon as any}
              size={32}
              color="#E50914"
            />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.menuContainer}>
        {MENU_ITEMS.map((item, index) => (
          <React.Fragment key={item.id}>
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => router.push(`/${item.id}`)}
            >
              <View style={styles.menuItemIcon}>
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={24}
                  color="#fff"
                />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemDescription}>
                  {item.description}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#666"
              />
            </Pressable>
            {index < MENU_ITEMS.length - 1 && <Divider style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed,
        ]}
      >
        <MaterialCommunityIcons name="logout" size={24} color="#E50914" />
        <Text style={styles.logoutButtonText}>Sair da conta</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#1a1a1a',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    marginHorizontal: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuContainer: {
    marginHorizontal: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    backgroundColor: '#333',
    height: 1,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    gap: 8,
  },
  logoutButtonPressed: {
    opacity: 0.7,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E50914',
  },
}); 