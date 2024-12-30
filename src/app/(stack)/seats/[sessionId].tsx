import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Dimensions, Pressable } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

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

  const getSeatType = (row: string, seatNumber: string) => {
    const position = `${row}${seatNumber}`;
    if (['G02', 'G06'].includes(position)) return 'couple';
    if (['E04', 'E05', 'F04', 'F05'].includes(position)) return 'premium';
    if (['G01', 'G03', 'G05'].includes(position)) return 'wheelchair';
    return 'standard';
  };

  const toggleSeat = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const [row, number] = [seatId[0], seatId.slice(1)];
      const type = getSeatType(row, number);
      return total + SEAT_TYPES[type].price;
    }, 0);
  };

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
            <Text style={styles.movieTitle}>Wonka</Text>
            <Text style={styles.sessionInfo}>Sala 1 - IMAX • 14:30</Text>
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
            {/* Remova ou comente este bloco
            <View style={styles.columnNumbers}>
              <View style={styles.rowLetterPlaceholder} />
              {Array.from({ length: 8 }, (_, i) => (
                <Text key={i} style={styles.gridNumber}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
              ))}
            </View>
            */}

            {/* Seats */}
            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((row) => (
              <View key={row} style={styles.seatRow}>
                <Text style={styles.rowLetter}>{row}</Text>
                <View style={styles.seatsGrid}>
                  {Array.from({ length: 8 }, (_, i) => {
                    const seatNumber = String(i + 1).padStart(2, '0');
                    const seatId = `${row}${seatNumber}`;
                    const type = getSeatType(row, seatNumber);
                    const isSelected = selectedSeats.includes(seatId);

                    return (
                      <Pressable
                        key={seatId}
                        style={[
                          styles.seatWrapper,
                          isSelected && styles.selectedSeatWrapper
                        ]}
                        onPress={() => toggleSeat(seatId)}
                      >
                        <LinearGradient
                          colors={[
                            isSelected ? '#E50914' : SEAT_TYPES[type].color,
                            isSelected ? '#B71C1C' : SEAT_TYPES[type].color + '80'
                          ]}
                          style={styles.seat}
                        >
                          <MaterialCommunityIcons
                            name={SEAT_TYPES[type].icon}
                            size={16}
                            color="#fff"
                          />
                          <Text style={styles.seatNumber}>{seatNumber}</Text>
                        </LinearGradient>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
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
                {selectedSeats.length} {selectedSeats.length === 1 ? 'assento' : 'assentos'}
              </Text>
              <Text style={styles.totalPrice}>
                R$ {getTotalPrice().toFixed(2)}
              </Text>
            </View>
            <Pressable 
              style={styles.continueButton}
              onPress={() => router.push('/(stack)/checkout' as any)}
            >
              <Text style={styles.continueText}>Continuar</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
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
});