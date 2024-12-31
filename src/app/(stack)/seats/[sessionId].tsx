import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Dimensions, Pressable } from 'react-native';
import { Text, IconButton, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSessionStore, Seat } from '@/features/sessions/stores/sessionStore';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 32; // 16px de padding de cada lado
const ROW_LETTER_WIDTH = 24; // largura da coluna com as letras das fileiras
const SEAT_GAP = 8; // espaço entre os assentos
const SEATS_PER_ROW = 8;

const SEAT_SIZE = Math.floor(
  (width - HORIZONTAL_PADDING - ROW_LETTER_WIDTH - (SEAT_GAP * (SEATS_PER_ROW - 1))) / SEATS_PER_ROW
);

const SEAT_TYPES = {
  standard: {
    icon: 'seat' as const,
    color: '#E67E22',
    label: 'Standard',
    price: 35.00
  },
  couple: {
    icon: 'sofa' as const,
    color: '#E91E63',
    label: 'Namorados',
    price: 70.00
  },
  premium: {
    icon: 'seat-recline-extra' as const,
    color: '#3498DB',
    label: 'Premium',
    price: 45.00
  },
  wheelchair: {
    icon: 'wheelchair-accessibility' as const,
    color: '#2ECC71',
    label: 'Acessível',
    price: 35.00
  }
} as const;

type SeatType = keyof typeof SEAT_TYPES;

export default function SeatsScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const { currentSession, loading, error, fetchSession } = useSessionStore();

  useEffect(() => {
    if (sessionId) {
      fetchSession(String(sessionId));
    }
  }, [sessionId]);

  const toggleSeat = (seatId: string) => {
    const seat = currentSession?.seats.find(s => s.id === seatId);
    if (seat?.status === 'occupied') return;

    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = currentSession?.seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  if (error || !currentSession) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.errorText}>Erro ao carregar sessão</Text>
          <Pressable 
            style={styles.retryButton} 
            onPress={() => fetchSession(String(sessionId))}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const seats = currentSession.seats || [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="chevron-left"
            iconColor="#fff"
            size={24}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.movieTitle}>{currentSession.movieTitle}</Text>
            <Text style={styles.sessionInfo}>
              {currentSession.room} - {currentSession.technology} • {currentSession.time}
            </Text>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Screen */}
          <LinearGradient
            colors={['#333', '#1A1A1A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.screen}
          >
            <Text style={styles.screenText}>TELA</Text>
          </LinearGradient>

          {/* Seats Grid */}
          <View style={styles.seatsContainer}>
            {loading ? (
              <View style={styles.inlineLoading}>
                <ActivityIndicator size="large" color="#E50914" />
              </View>
            ) : (
              rows.map((row) => (
                <View key={row} style={styles.seatRow}>
                  <Text style={styles.rowLetter}>{row}</Text>
                  <View style={styles.seatsGrid}>
                    {currentSession.seats
                      .filter(seat => seat.row === row)
                      .map((seat) => {
                        const isSelected = selectedSeats.includes(seat.id);
                        const isOccupied = seat.status === 'occupied';

                        return (
                          <Pressable
                            key={seat.id}
                            style={[
                              styles.seatWrapper,
                              isSelected && styles.selectedSeatWrapper,
                              isOccupied && styles.occupiedSeatWrapper
                            ]}
                            onPress={() => toggleSeat(seat.id)}
                            disabled={isOccupied}
                          >
                            <LinearGradient
                              colors={[
                                isOccupied ? '#666' :
                                isSelected ? '#E50914' : 
                                SEAT_TYPES[seat.type].color,
                                isOccupied ? '#444' :
                                isSelected ? '#B71C1C' : 
                                SEAT_TYPES[seat.type].color + '80'
                              ]}
                              style={styles.seat}
                            >
                              <MaterialCommunityIcons
                                name={SEAT_TYPES[seat.type].icon}
                                size={16}
                                color={isOccupied ? '#333' : '#fff'}
                              />
                              <Text style={[
                                styles.seatNumber,
                                isOccupied && styles.occupiedSeatNumber
                              ]}>
                                {seat.number}
                              </Text>
                            </LinearGradient>
                          </Pressable>
                        );
                    })}
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            {Object.entries(SEAT_TYPES).map(([key, value]) => (
              <View key={key} style={styles.legendItem}>
                <LinearGradient
                  colors={[value.color, value.color + '80']}
                  style={styles.legendIcon}
                >
                  <MaterialCommunityIcons 
                    name={value.icon} 
                    size={12} 
                    color="#fff" 
                  />
                </LinearGradient>
                <Text style={styles.legendText}>{value.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <LinearGradient
          colors={['transparent', '#000']}
          style={styles.footerGradient}
        >
          <View style={styles.footer}>
            <View style={styles.priceInfo}>
              <Text style={styles.selectedCount}>
                {selectedSeats.length} {selectedSeats.length === 1 ? 'assento' : 'assentos'} selecionado{selectedSeats.length !== 1 ? 's' : ''}
              </Text>
              <Text style={styles.totalPrice}>
                R$ {getTotalPrice().toFixed(2)}
              </Text>
            </View>
            <Pressable
              style={[
                styles.continueButton,
                selectedSeats.length === 0 && { opacity: 0.5 }
              ]}
              onPress={() => {
                if (selectedSeats.length > 0) {
                  router.push('/(stack)/payment');
                }
              }}
              disabled={selectedSeats.length === 0}
            >
              <Text style={styles.continueText}>Continuar</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.promotion}>
            <MaterialCommunityIcons name="ticket-percent" size={20} color="#E50914" />
            <Text style={styles.promotionText}>
              Super Segunda: 25% em todos os assentos
            </Text>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    margin: 0,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  sessionInfo: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 200,
  },
  screen: {
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  screenText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  seatsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  columnNumbers: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  rowLetterPlaceholder: {
    width: 24,
  },
  gridNumber: {
    color: '#666',
    fontSize: 12,
    width: SEAT_SIZE,
    textAlign: 'center',
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  rowLetter: {
    color: '#666',
    fontSize: 12,
    width: ROW_LETTER_WIDTH,
    textAlign: 'center',
  },
  seatsGrid: {
    flexDirection: 'row',
    gap: SEAT_GAP,
    flex: 1,
    justifyContent: 'center',
  },
  seatWrapper: {
    width: SEAT_SIZE,
    aspectRatio: 1,
  },
  selectedSeatWrapper: {
    transform: [{ scale: 1.05 }],
  },
  seat: {
    flex: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  seatNumber: {
    color: '#fff',
    fontSize: 8,
    marginTop: -2,
    opacity: 0.8,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendText: {
    color: '#999',
    fontSize: 13,
  },
  footerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 32,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  priceInfo: {
    flex: 1,
  },
  selectedCount: {
    color: '#999',
    fontSize: 14,
  },
  totalPrice: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E50914',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  promotion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E50914',
  },
  promotionText: {
    color: '#E50914',
    fontSize: 14,
    fontWeight: '500',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#E50914',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#E50914',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  occupiedSeatWrapper: {
    opacity: 0.5,
  },
  occupiedSeatNumber: {
    color: '#333',
  },
  inlineLoading: {
    padding: 20,
    alignItems: 'center',
  },
});