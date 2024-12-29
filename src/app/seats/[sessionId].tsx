import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions, Vibration } from 'react-native';
import { Text, Button, IconButton, Chip, Portal, Dialog } from 'react-native-paper';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const SEAT_SIZE = (width - 64) / 10;
const MAX_SEATS = 6; // Máximo de assentos por compra

// Dados mockados (depois substituir por API)
const MOCK_SESSION = {
  id: '1',
  movieTitle: 'Duna: Parte 2',
  room: 'Sala VIP',
  type: 'IMAX',
  datetime: '2024-03-20T14:30:00',
  price: 45.0,
};

const MOCK_SEATS = Array.from({ length: 80 }, (_, i) => ({
  id: String(i + 1),
  row: String.fromCharCode(65 + Math.floor(i / 10)),
  number: (i % 10) + 1,
  status: Math.random() > 0.3 ? 'available' : 'occupied',
  price: MOCK_SESSION.price,
  type: Math.random() > 0.8 ? 'wheelchair' : 'regular'
}));

type SeatStatus = 'available' | 'occupied' | 'selected';
type SeatType = 'regular' | 'wheelchair';

interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  price: number;
  type: SeatType;
}

export default function SeatsScreen() {
  const { sessionId } = useLocalSearchParams();
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showMaxSeatsDialog, setShowMaxSeatsDialog] = useState(false);

  const handleSeatPress = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    
    Vibration.vibrate(50); // Feedback tátil

    setSelectedSeats(prev => {
      if (prev.includes(seat.id)) {
        return prev.filter(id => id !== seat.id);
      }
      if (prev.length >= MAX_SEATS) {
        setShowMaxSeatsDialog(true);
        return prev;
      }
      return [...prev, seat.id];
    });
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = MOCK_SEATS.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const getSelectedSeatsText = () => {
    return selectedSeats
      .map(id => {
        const seat = MOCK_SEATS.find(s => s.id === id);
        return `${seat?.row}${seat?.number}`;
      })
      .join(', ');
  };

  const renderSeat = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.id);
    const isOccupied = seat.status === 'occupied';
    const isWheelchair = seat.type === 'wheelchair';

    return (
      <Animated.View 
        key={seat.id}
        entering={FadeIn.delay(Number(seat.id) * 20)}
      >
        <IconButton
          icon={
            isWheelchair 
              ? 'wheelchair' 
              : isOccupied 
                ? 'seat' 
                : isSelected 
                  ? 'seat-recline-extra' 
                  : 'seat-outline'
          }
          size={SEAT_SIZE - 8}
          iconColor={
            isOccupied 
              ? '#666' 
              : isSelected 
                ? '#E50914' 
                : isWheelchair 
                  ? '#4CAF50' 
                  : '#fff'
          }
          disabled={isOccupied}
          onPress={() => handleSeatPress(seat)}
          style={styles.seat}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Animated.View 
          entering={FadeInDown}
          style={styles.header}
        >
          <Text style={styles.movieTitle}>{MOCK_SESSION.movieTitle}</Text>
          <View style={styles.sessionInfo}>
            <Chip style={styles.chip}>{MOCK_SESSION.room}</Chip>
            <Chip style={styles.chip}>{MOCK_SESSION.type}</Chip>
          </View>
        </Animated.View>

        <View style={styles.screen}>
          <LinearGradient
            colors={['#E5091422', 'transparent']}
            style={styles.screenGlow}
          />
          <View style={styles.screenIndicator} />
          <Text style={styles.screenText}>TELA</Text>
        </View>

        <View style={styles.seatsContainer}>
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              <Text style={styles.rowLabel}>
                {String.fromCharCode(65 + rowIndex)}
              </Text>
              <View style={styles.seats}>
                {MOCK_SEATS
                  .slice(rowIndex * 10, (rowIndex + 1) * 10)
                  .map(renderSeat)}
              </View>
              <Text style={styles.rowLabel}>
                {String.fromCharCode(65 + rowIndex)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <IconButton icon="seat-outline" size={24} iconColor="#fff" />
            <Text style={styles.legendText}>Disponível</Text>
          </View>
          <View style={styles.legendItem}>
            <IconButton icon="seat-recline-extra" size={24} iconColor="#E50914" />
            <Text style={styles.legendText}>Selecionado</Text>
          </View>
          <View style={styles.legendItem}>
            <IconButton icon="wheelchair" size={24} iconColor="#4CAF50" />
            <Text style={styles.legendText}>Acessível</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <LinearGradient
          colors={['transparent', '#000']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.selectedSeats}>
              {selectedSeats.length > 0 
                ? `Assentos: ${getSelectedSeatsText()}`
                : 'Selecione seus assentos'}
            </Text>
            <Text style={styles.totalPrice}>
              {selectedSeats.length > 0 && `R$ ${getTotalPrice().toFixed(2)}`}
            </Text>
          </View>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonLabel}
            disabled={selectedSeats.length === 0}
            onPress={() => router.push({
              pathname: '/checkout',
              params: { 
                seats: selectedSeats.join(','),
                total: getTotalPrice(),
                sessionId
              }
            })}
          >
            Continuar
          </Button>
        </View>
      </View>

      <Portal>
        <Dialog
          visible={showMaxSeatsDialog}
          onDismiss={() => setShowMaxSeatsDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Limite de Assentos
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Você pode selecionar no máximo {MAX_SEATS} assentos por compra.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setShowMaxSeatsDialog(false)}
              textColor="#E50914"
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    paddingTop: 0,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sessionInfo: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: '#E5091422',
  },
  screen: {
    alignItems: 'center',
    marginVertical: 32,
    position: 'relative',
  },
  screenGlow: {
    position: 'absolute',
    width: width * 0.7,
    height: 40,
    top: -20,
  },
  screenIndicator: {
    width: width * 0.7,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    transform: [{ perspective: 500 }, { rotateX: '60deg' }],
  },
  screenText: {
    color: '#666',
    marginTop: 8,
    fontSize: 12,
  },
  seatsContainer: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: {
    color: '#666',
    width: 20,
    textAlign: 'center',
  },
  seats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  seat: {
    margin: 0,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 32,
    marginBottom: 32,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    color: '#fff',
    marginLeft: -8,
  },
  footer: {
    padding: 16,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  selectedSeats: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  totalPrice: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#E50914',
  },
  buttonLabel: {
    fontSize: 16,
    paddingHorizontal: 8,
  },
  dialog: {
    backgroundColor: '#1a1a1a',
  },
  dialogTitle: {
    color: '#fff',
  },
  dialogText: {
    color: '#fff',
  },
}); 