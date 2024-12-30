import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Text, Surface, Modal, Portal, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { API_CONFIG, SIZES } from '../core/config/api';
import { useTicketStore } from '../features/tickets/stores/ticketStore';
import type { Ticket } from '../features/tickets/types/ticket';
import QRCode from 'react-native-qrcode-svg';

const { width } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.28;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

export default function TicketsScreen() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { tickets, loadTickets } = useTicketStore();

  useEffect(() => {
    loadTickets();
  }, []);

  const renderTicketCard = (ticket: Ticket) => (
    <Pressable
      key={ticket.id}
      onPress={() => setSelectedTicket(ticket)}
      style={({ pressed }) => [
        styles.ticketCard,
        pressed && styles.ticketCardPressed,
      ]}
    >
      <Image
        source={{ uri: `${API_CONFIG.imageBaseUrl}/${SIZES.poster.w342}${ticket.posterPath}` }}
        style={styles.poster}
        contentFit="cover"
      />
      <View style={styles.ticketInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {ticket.movieTitle}
        </Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#666" />
            <Text style={styles.detailText}>{ticket.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{ticket.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="seat" size={16} color="#666" />
            <Text style={styles.detailText}>
              {ticket.seats.join(', ')}
            </Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              ticket.status === 'used' && styles.statusUsed,
              ticket.status === 'expired' && styles.statusExpired,
            ]}
          >
            <Text style={styles.statusText}>
              {ticket.status === 'valid' && 'Válido'}
              {ticket.status === 'used' && 'Utilizado'}
              {ticket.status === 'expired' && 'Expirado'}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Ingressos</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.ticketsContainer}
        showsVerticalScrollIndicator={false}
      >
        {tickets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="ticket-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>
              Você ainda não possui ingressos
            </Text>
            <Text style={styles.emptySubtext}>
              Seus ingressos aparecerão aqui após a compra
            </Text>
          </View>
        ) : (
          tickets.map(renderTicketCard)
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={!!selectedTicket}
          onDismiss={() => setSelectedTicket(null)}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedTicket && (
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Detalhes do Ingresso</Text>
                <Pressable
                  onPress={() => setSelectedTicket(null)}
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && styles.closeButtonPressed,
                  ]}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#fff" />
                </Pressable>
              </View>

              <View style={styles.ticketDetails}>
                <Image
                  source={{
                    uri: `${API_CONFIG.imageBaseUrl}/${SIZES.poster.w342}${selectedTicket.posterPath}`,
                  }}
                  style={styles.modalPoster}
                  contentFit="cover"
                />

                <View style={styles.modalInfo}>
                  <Text style={styles.modalMovieTitle}>
                    {selectedTicket.movieTitle}
                  </Text>

                  <View style={styles.modalDetailsContainer}>
                    <View style={styles.modalDetailRow}>
                      <MaterialCommunityIcons
                        name="calendar"
                        size={20}
                        color="#666"
                      />
                      <Text style={styles.modalDetailText}>
                        {selectedTicket.date}
                      </Text>
                    </View>

                    <View style={styles.modalDetailRow}>
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={20}
                        color="#666"
                      />
                      <Text style={styles.modalDetailText}>
                        {selectedTicket.time}
                      </Text>
                    </View>

                    <View style={styles.modalDetailRow}>
                      <MaterialCommunityIcons
                        name="seat"
                        size={20}
                        color="#666"
                      />
                      <Text style={styles.modalDetailText}>
                        {selectedTicket.seats.join(', ')}
                      </Text>
                    </View>

                    <View style={styles.modalDetailRow}>
                      <MaterialCommunityIcons
                        name="door"
                        size={20}
                        color="#666"
                      />
                      <Text style={styles.modalDetailText}>
                        Sala {selectedTicket.room}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.qrCodeContainer}>
                  <QRCode
                    value={selectedTicket.qrCode}
                    size={200}
                    color="#000"
                    backgroundColor="#fff"
                  />
                </View>

                <Text style={styles.qrCodeHelp}>
                  Apresente este QR Code na entrada da sala
                </Text>
              </View>
            </View>
          )}
        </Modal>
      </Portal>
    </View>
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
  ticketsContainer: {
    padding: 16,
    gap: 16,
  },
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  ticketCardPressed: {
    opacity: 0.8,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
  },
  ticketInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#ccc',
    fontSize: 14,
  },
  statusContainer: {
    marginTop: 12,
  },
  statusBadge: {
    backgroundColor: 'rgba(50, 215, 75, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusUsed: {
    backgroundColor: 'rgba(255, 159, 10, 0.1)',
  },
  statusExpired: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
  },
  statusText: {
    color: '#32D74B',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  modalContainer: {
    backgroundColor: '#1a1a1a',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonPressed: {
    opacity: 0.8,
  },
  ticketDetails: {
    alignItems: 'center',
  },
  modalPoster: {
    width: POSTER_WIDTH * 1.2,
    height: POSTER_HEIGHT * 1.2,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalInfo: {
    width: '100%',
    marginBottom: 24,
  },
  modalMovieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDetailsContainer: {
    gap: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalDetailText: {
    color: '#ccc',
    fontSize: 16,
  },
  qrCodeContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  qrCodeHelp: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
}); 