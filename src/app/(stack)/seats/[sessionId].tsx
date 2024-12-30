import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Platform, Pressable, Dimensions } from 'react-native';
import { Text, SegmentedButtons, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type SeatType = keyof typeof SEAT_TYPES;

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
};

export default function SeatsScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const [tab, setTab] = useState('map');
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
        <LinearGradient
          colors={['#000', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <IconButton
              icon="chevron-left"
              iconColor="#fff"
              size={28}
              onPress={() => router.back()}
              style={styles.backButton}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.movieTitle}>Wonka</Text>
              <Text style={styles.sessionInfo}>Sala 1 - IMAX • 14:30</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabs}>
          <SegmentedButtons
            value={tab}
            onValueChange={setTab}
            buttons={[
              {
                value: 'map',
                label: 'Mapa de Assentos',
                style: [
                  styles.tabButton,
                  tab === 'map' && styles.activeTabButton
                ],
                labelStyle: [
                  styles.tabLabel,
                  tab === 'map' && styles.activeTabLabel
                ]
              },
              {
                value: 'info',
                label: 'Informações',
                style: [
                  styles.tabButton,
                  tab === 'info' && styles.activeTabButton
                ],
                labelStyle: [
                  styles.tabLabel,
                  tab === 'info' && styles.activeTabLabel
                ]
              }
            ]}
            style={styles.segmentedButtons}
          />
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
            {/* Column Numbers */}
            <View style={styles.columnNumbers}>
              {Array.from({ length: 8 }, (_, i) => (
                <Text key={i} style={styles.gridNumber}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
              ))}
            </View>

            {/* Seats */}
            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((row) => (
              <View key={row} style={styles.seatRow}>
                <Text style={styles.rowLetter}>{row}</Text>
                <View style={styles.seats}>
                  {Array.from({ length: 6 }, (_, i) => {
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
                            size={20}
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
                <View style={[styles.legendIcon, { backgroundColor: value.color }]}>
                  <MaterialCommunityIcons name={value.icon} size={16} color="#fff" />
                </View>
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
  headerGradient: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  backButton: {
    margin: 0,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  sessionInfo: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  tabs: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  segmentedButtons: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    gap: 0,
  },
  tabButton: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderRadius: 8,
    flex: 1,
  },
  activeTabButton: {
    backgroundColor: '#E50914',
  },
  tabLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 200,
  },
  screen: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  screenText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  seatsContainer: {
    alignItems: 'center',
  },
  columnNumbers: {
    flexDirection: 'row',
    width: '85%',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  gridNumber: {
    color: '#666',
    fontSize: 12,
    width: 24,
    textAlign: 'center',
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowLetter: {
    color: '#666',
    fontSize: 12,
    width: 24,
    textAlign: 'center',
  },
  seats: {
    flexDirection: 'row',
    gap: 8,
  },
  seatWrapper: {
    width: width * 0.11,
    aspectRatio: 1,
    padding: 2,
  },
  selectedSeatWrapper: {
    transform: [{ scale: 1.05 }],
  },
  seat: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatNumber: {
    color: '#fff',
    fontSize: 10,
    marginTop: -2,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 32,
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
    fontSize: 12,
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