import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Pressable, StatusBar, ScrollView } from 'react-native';
import { Text, IconButton, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { SeatTypes } from '@/features/seats/components/SeatTypes';
import { PromotionBanner } from '@/features/seats/components/PromotionBanner';
import { SelectionSummary } from '@/features/seats/components/SelectionSummary';

const { width, height } = Dimensions.get('window');
const HORIZONTAL_PADDING = 32;
const ROW_LETTER_WIDTH = 24;
const SEAT_GAP = 8;
const SEATS_PER_ROW = 8;

const SEAT_SIZE = Math.floor(
  (width - HORIZONTAL_PADDING - ROW_LETTER_WIDTH - (SEAT_GAP * (SEATS_PER_ROW - 1))) / SEATS_PER_ROW
);

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
      <SafeAreaView style={styles.safeArea}>
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

        {/* Seat Types */}
        <SeatTypes />

        {/* Scrollable Content */}
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
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
              <ActivityIndicator size="large" color="#E50914" />
            ) : (
              rows.map((row) => (
                <View key={row} style={styles.seatRow}>
                  <Text style={styles.rowLetter}>{row}</Text>
                  <View style={styles.seatsGrid}>
                    {seats
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
                                '#333',
                                isOccupied ? '#444' :
                                isSelected ? '#B71C1C' : 
                                '#1A1A1A'
                              ]}
                              style={styles.seat}
                            >
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
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <PromotionBanner />
          <SelectionSummary 
            selectedSeats={selectedSeats}
            totalPrice={getTotalPrice()}
            onContinue={() => {
              if (selectedSeats.length > 0) {
                router.push('/(stack)/payment');
              }
            }}
          />
        </View>
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
    height: 56,
  },
  backButton: {
    margin: 0,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  sessionInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  screen: {
    height: 32,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  screenText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  seatsContainer: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: 24,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatNumber: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  bottomSection: {
    padding: 16,
    gap: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
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
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
});