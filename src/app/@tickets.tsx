import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { theme, rem } from '@/theme';

export default function TicketsScreen() {
  const purchaseHistory = useSessionStore(state => state.purchaseHistory);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  if (purchaseHistory.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons 
          name="ticket-confirmation-outline" 
          size={rem(6)} 
          color={theme.colors.textSecondary} 
        />
        <Text style={styles.emptyText}>
          Você ainda não possui ingressos.{'\n'}
          Que tal assistir a um filme hoje?
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Meus Ingressos</Text>

      {purchaseHistory.map((ticket, index) => (
        <Animated.View 
          key={ticket.id}
          entering={FadeInDown.delay(index * 100)}
        >
          <Pressable>
            <LinearGradient
              colors={['#1a1a1a', '#262626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ticketCard}
            >
              <View style={styles.ticketHeader}>
                <Text style={styles.movieTitle}>{ticket.movieTitle}</Text>
                <View style={styles.techBadge}>
                  <Text style={styles.techText}>{ticket.technology}</Text>
                </View>
              </View>

              <View style={styles.ticketInfo}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="calendar" size={rem(1.25)} color="#999" />
                  <Text style={styles.infoText}>{ticket.date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="clock-outline" size={rem(1.25)} color="#999" />
                  <Text style={styles.infoText}>{ticket.time}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="theater" size={rem(1.25)} color="#999" />
                  <Text style={styles.infoText}>Sala {ticket.room}</Text>
                </View>
              </View>

              <View style={styles.seatsContainer}>
                <Text style={styles.seatsLabel}>Assentos:</Text>
                <View style={styles.seatsList}>
                  {ticket.seats.map((seat) => (
                    <View key={seat} style={styles.seatBadge}>
                      <Text style={styles.seatText}>{seat}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.footer}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Total</Text>
                  <Text style={styles.priceValue}>
                    R$ {ticket.totalPrice.toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.purchaseDate}>
                  Comprado em {formatDate(ticket.purchaseDate)}
                </Text>
              </View>

              <View style={styles.qrContainer}>
                <MaterialCommunityIcons 
                  name="qrcode" 
                  size={rem(5)} 
                  color={theme.colors.primary} 
                />
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: rem(1.5),
    paddingBottom: rem(10),
  },
  title: {
    fontSize: rem(1.75),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: rem(2),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: rem(2),
  },
  emptyText: {
    fontSize: rem(1.125),
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: rem(1.5),
    lineHeight: rem(1.5),
  },
  ticketCard: {
    borderRadius: rem(1.25),
    padding: rem(1.5),
    marginBottom: rem(1.5),
    borderWidth: 1,
    borderColor: '#333',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rem(1.5),
  },
  movieTitle: {
    fontSize: rem(1.25),
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: rem(1),
  },
  techBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: rem(0.75),
    paddingVertical: rem(0.25),
    borderRadius: rem(0.25),
  },
  techText: {
    color: '#fff',
    fontSize: rem(0.75),
    fontWeight: '600',
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rem(1.5),
    backgroundColor: '#1a1a1a',
    padding: rem(1),
    borderRadius: rem(0.75),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
  },
  infoText: {
    color: '#999',
    fontSize: rem(0.875),
  },
  seatsContainer: {
    marginBottom: rem(1.5),
  },
  seatsLabel: {
    color: '#999',
    fontSize: rem(0.875),
    marginBottom: rem(0.5),
  },
  seatsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rem(0.5),
  },
  seatBadge: {
    backgroundColor: '#333',
    paddingHorizontal: rem(0.75),
    paddingVertical: rem(0.25),
    borderRadius: rem(0.25),
  },
  seatText: {
    color: '#fff',
    fontSize: rem(0.75),
    fontWeight: '500',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: rem(1),
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rem(0.5),
  },
  priceLabel: {
    color: '#999',
    fontSize: rem(0.875),
  },
  priceValue: {
    color: '#fff',
    fontSize: rem(1.25),
    fontWeight: 'bold',
  },
  purchaseDate: {
    color: '#666',
    fontSize: rem(0.75),
    textAlign: 'right',
  },
  qrContainer: {
    position: 'absolute',
    right: rem(1.5),
    bottom: rem(1.5),
    opacity: 0.2,
  },
}); 