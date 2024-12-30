import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { Text, Avatar, Button, Card, Chip, Portal, Modal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { API_CONFIG, SIZES } from '../core/config/api';
import { useTicketStore } from '../features/tickets/stores/ticketStore';
import type { Ticket } from '../features/tickets/types/ticket';

const { width } = Dimensions.get('window');
const TICKET_WIDTH = width * 0.8;

// Mock data - Substituir por dados reais depois
const USER = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  avatar: 'https://i.pravatar.cc/300',
  preferences: {
    genres: ['Ação', 'Ficção Científica', 'Aventura'],
    notifications: true,
    darkMode: true,
  }
};

export default function ProfileScreen() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const router = useRouter();
  const { tickets, loading, error, loadUserTickets } = useTicketStore();

  useEffect(() => {
    loadUserTickets(USER.id);
  }, []);

  const stats = {
    total: tickets.length,
    thisMonth: tickets.filter(t => {
      const ticketDate = new Date(t.date);
      const now = new Date();
      return ticketDate.getMonth() === now.getMonth();
    }).length,
    upcoming: tickets.filter(t => t.status === 'upcoming').length,
  };

  const renderTicket = (ticket: Ticket) => (
    <Pressable
      key={ticket.id}
      onPress={() => setSelectedTicket(ticket)}
      style={({ pressed }) => [
        styles.ticketCard,
        pressed && styles.ticketCardPressed
      ]}
    >
      <Image
        source={{ uri: `${API_CONFIG.imageBaseUrl}/${SIZES.poster.w185}${ticket.posterPath}` }}
        style={styles.ticketPoster}
        contentFit="cover"
      />
      <View style={styles.ticketInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {ticket.movieTitle}
        </Text>
        <View style={styles.ticketDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#E50914" />
            <Text style={styles.detailText}>{ticket.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#E50914" />
            <Text style={styles.detailText}>{ticket.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="theater" size={16} color="#E50914" />
            <Text style={styles.detailText}>{ticket.room}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="seat" size={16} color="#E50914" />
            <Text style={styles.detailText}>{ticket.seats.join(', ')}</Text>
          </View>
        </View>
        <Chip
          mode="outlined"
          style={[
            styles.statusChip,
            { borderColor: ticket.status === 'upcoming' ? '#32D74B' : '#999' }
          ]}
          textStyle={{ 
            color: ticket.status === 'upcoming' ? '#32D74B' : '#999',
            fontSize: 12
          }}
        >
          {ticket.status === 'upcoming' ? 'Em breve' : 'Utilizado'}
        </Chip>
      </View>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#E50914', '#000']}
        style={styles.header}
      >
        <View style={styles.profileInfo}>
          <Avatar.Image
            source={{ uri: USER.avatar }}
            size={80}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{USER.name}</Text>
            <Text style={styles.userEmail}>{USER.email}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Filmes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.thisMonth}</Text>
            <Text style={styles.statLabel}>Este mês</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.upcoming}</Text>
            <Text style={styles.statLabel}>Agendados</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.preferences}>
        <Text style={styles.sectionTitle}>Suas Preferências</Text>
        <View style={styles.genreContainer}>
          {USER.preferences.genres.map((genre) => (
            <Chip
              key={genre}
              mode="outlined"
              style={styles.genreChip}
              textStyle={styles.genreText}
            >
              {genre}
            </Chip>
          ))}
        </View>
        <View style={styles.settingsContainer}>
          <Button
            mode="outlined"
            icon="bell"
            style={styles.settingButton}
            textColor="#fff"
          >
            Notificações {USER.preferences.notifications ? 'Ativadas' : 'Desativadas'}
          </Button>
          <Button
            mode="outlined"
            icon="theme-light-dark"
            style={styles.settingButton}
            textColor="#fff"
          >
            Tema {USER.preferences.darkMode ? 'Escuro' : 'Claro'}
          </Button>
        </View>
      </View>

      <View style={styles.tickets}>
        <Text style={styles.sectionTitle}>Seus Ingressos</Text>
        {loading ? (
          <ActivityIndicator color="#E50914" style={styles.loading} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button 
              mode="contained" 
              onPress={() => loadUserTickets(USER.id)}
              buttonColor="#E50914"
            >
              Tentar Novamente
            </Button>
          </View>
        ) : tickets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="ticket-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>Você ainda não tem ingressos</Text>
            <Button 
              mode="contained" 
              onPress={() => router.push('/')}
              buttonColor="#E50914"
              style={styles.emptyButton}
            >
              Comprar Ingressos
            </Button>
          </View>
        ) : (
          tickets.map(renderTicket)
        )}
      </View>

      <Portal>
        <Modal
          visible={!!selectedTicket}
          onDismiss={() => setSelectedTicket(null)}
          contentContainerStyle={styles.modal}
        >
          {selectedTicket && (
            <View>
              <Text style={styles.modalTitle}>Ingresso Digital</Text>
              <Image
                source={{ uri: selectedTicket.qrCode }}
                style={styles.qrCode}
                contentFit="contain"
              />
              <View style={styles.modalDetails}>
                <Text style={styles.modalMovieTitle}>{selectedTicket.movieTitle}</Text>
                <View style={styles.modalInfo}>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="calendar" size={16} color="#E50914" />
                    <Text style={styles.modalDetailText}>{selectedTicket.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color="#E50914" />
                    <Text style={styles.modalDetailText}>{selectedTicket.time}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="theater" size={16} color="#E50914" />
                    <Text style={styles.modalDetailText}>{selectedTicket.room}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="seat" size={16} color="#E50914" />
                    <Text style={styles.modalDetailText}>{selectedTicket.seats.join(', ')}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="cash" size={16} color="#E50914" />
                    <Text style={styles.modalDetailText}>R$ {selectedTicket.price.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
              <Button
                mode="contained"
                onPress={() => setSelectedTicket(null)}
                style={styles.modalButton}
                buttonColor="#E50914"
              >
                Fechar
              </Button>
            </View>
          )}
        </Modal>
      </Portal>
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
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#ccc',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#333',
  },
  preferences: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  genreChip: {
    backgroundColor: 'transparent',
    borderColor: '#E50914',
  },
  genreText: {
    color: '#fff',
  },
  settingsContainer: {
    gap: 12,
  },
  settingButton: {
    borderColor: '#333',
  },
  tickets: {
    padding: 20,
  },
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    width: TICKET_WIDTH,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  ticketCardPressed: {
    opacity: 0.8,
  },
  ticketPoster: {
    width: 100,
    height: 150,
  },
  ticketInfo: {
    flex: 1,
    padding: 12,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  ticketDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#ccc',
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  modal: {
    backgroundColor: '#1a1a1a',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  modalDetails: {
    width: '100%',
    marginBottom: 20,
  },
  modalMovieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalInfo: {
    gap: 8,
  },
  modalDetailText: {
    fontSize: 16,
    color: '#ccc',
  },
  modalButton: {
    width: '100%',
  },
  loading: {
    marginTop: 32,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 16,
  },
  errorText: {
    color: '#E50914',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 16,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 8,
  },
}); 