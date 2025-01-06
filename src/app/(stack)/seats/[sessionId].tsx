import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Pressable, StatusBar, ScrollView } from 'react-native';
import { Text, IconButton, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { PromotionBanner } from '@/features/seats/components/PromotionBanner';
import { SelectionSummary } from '@/features/seats/components/SelectionSummary';
import { colors } from '@/core/theme/colors';

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
  const { currentSession, loading, error, fetchSession, selectSeat, clearSelectedSeats } = useSessionStore();

  useEffect(() => {
    if (sessionId) {
      clearSelectedSeats();
      fetchSession(String(sessionId));
    }
    return () => {
      clearSelectedSeats();
    };
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

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollContent} 
          contentContainerStyle={styles.scrollContainer}
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

          {/* Bottom Info Container */}
          <View style={styles.bottomInfoContainer}>
            <PromotionBanner />
            <SelectionSummary 
              selectedSeats={selectedSeats}
              onContinue={() => {
                if (selectedSeats.length > 0) {
                  clearSelectedSeats();
                  selectedSeats.forEach(seatId => selectSeat(seatId));
                  router.push('/(stack)/payment');
                }
              }}
            />
          </View>
        </ScrollView>

        {/* Footer Gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.95)', '#000']}
          style={styles.bottomGradient}
          pointerEvents="none"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    color: colors.text,
  },
  sessionInfo: {
    fontSize: 12,
    color: colors.textSecondary,
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
    color: colors.textMuted,
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
    color: colors.textMuted,
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
    color: colors.text,
    fontSize: 10,
    fontWeight: '500',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    pointerEvents: 'none',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  occupiedSeatWrapper: {
    opacity: 0.5,
  },
  occupiedSeatNumber: {
    color: colors.textMuted,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  fixedBottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    zIndex: 10,
    elevation: 10,
  },
  selectionContainer: {
    marginTop: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 16,
  },
  bottomInfoContainer: {
    backgroundColor: colors.overlay.darker,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
});