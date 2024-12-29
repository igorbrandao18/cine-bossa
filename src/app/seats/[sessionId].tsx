import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Vibration, Dimensions } from 'react-native';
import { Text, Button, IconButton, Portal, Modal } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSessionStore } from '../../stores/sessionStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const MAX_SEATS = 6;

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'selected';
  type: 'standard' | 'vip' | 'imax' | 'couple';
}

const AnimatedView = Animated.createAnimatedComponent(View);

const Seat = React.memo(({ 
  seat, 
  onPress, 
  disabled 
}: { 
  seat: Seat; 
  onPress: () => void;
  disabled: boolean;
}) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePress = () => {
    if (disabled) return;
    
    Vibration.vibrate(50);
    scale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
    onPress();
  };

  const getSeatColor = () => {
    if (seat.status === 'selected') return '#E50914';
    if (seat.status === 'occupied') return '#666';
    return seat.type === 'vip' ? '#FFD700' : '#fff';
  };

  return (
    <Animated.View style={[styles.seatWrapper, animatedStyle]}>
      <IconButton
        icon={seat.status === 'occupied' ? 'seat' : 'seat-outline'}
        size={24}
        disabled={seat.status === 'occupied' || disabled}
        onPress={handlePress}
        iconColor={getSeatColor()}
      />
      <Text style={[
        styles.seatText,
        seat.status === 'occupied' && styles.seatTextDisabled,
        seat.type === 'vip' && styles.seatTextVip
      ]}>
        {seat.row}{seat.number}
      </Text>
    </Animated.View>
  );
});

// Função para gerar assentos mock com diferentes tipos
const generateSeats = (): Record<string, Seat[]> => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const seatsByRow: Record<string, Seat[]> = {};

  rows.forEach((row, rowIndex) => {
    seatsByRow[row] = [];
    for (let i = 1; i <= seatsPerRow; i++) {
      if (i === 7) { // Corredor
        seatsByRow[row].push({
          id: `${row}${i}`,
          row,
          number: i,
          status: 'occupied',
          type: 'standard'
        });
      } else {
        // Diferentes tipos de assentos por área
        let type: Seat['type'] = 'standard';
        
        // Fileiras D, E são VIP (meio da sala)
        if (['D', 'E'].includes(row)) {
          type = 'vip';
        }
        // Fileira F é IMAX
        else if (row === 'F') {
          type = 'imax';
        }
        // Últimas posições das fileiras são para casais
        else if (i === 1 || i === 12) {
          type = 'couple';
        }

        seatsByRow[row].push({
          id: `${row}${i}`,
          row,
          number: i,
          status: Math.random() > 0.9 ? 'occupied' : 'available',
          type
        });
      }
    }
  });

  return seatsByRow;
};

const getSeatPrice = (basePrice: number, type: Seat['type']): number => {
  switch (type) {
    case 'vip':
      return basePrice * 1.5;
    case 'imax':
      return basePrice * 2;
    case 'couple':
      return basePrice * 2.5;
    default:
      return basePrice;
  }
};

const getSeatColor = (status: string, type: string): string => {
  if (status === 'selected') return '#E50914';
  if (status === 'occupied') return '#666';
  switch (type) {
    case 'vip':
      return '#FFD700';
    case 'imax':
      return '#00FF00';
    case 'couple':
      return '#FF69B4';
    default:
      return '#fff';
  }
};

export default function SeatsScreen() {
  const { sessionId } = useLocalSearchParams();
  const router = useRouter();
  const session = useSessionStore(state => 
    state.sessions.find(s => s.id === sessionId)
  );
  const [seatsByRow, setSeatsByRow] = useState(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [showMaxSeatsModal, setShowMaxSeatsModal] = useState(false);
  const scale = useSharedValue(1);

  const handleSeatPress = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    
    if (selectedSeats.length >= MAX_SEATS && seat.status !== 'selected') {
      setShowMaxSeatsModal(true);
      return;
    }

    setSeatsByRow(prev => {
      const newSeatsByRow = { ...prev };
      newSeatsByRow[seat.row] = prev[seat.row].map(s => {
        if (s.id === seat.id) {
          return { ...s, status: s.status === 'selected' ? 'available' : 'selected' };
        }
        return s;
      });
      return newSeatsByRow;
    });

    setSelectedSeats(prev => {
      if (seat.status === 'selected') {
        return prev.filter(s => s.id !== seat.id);
      }
      return [...prev, { ...seat, status: 'selected' }];
    });
  };

  const handleConfirm = () => {
    // TODO: Implementar confirmação
    router.push({
      pathname: '/checkout',
      params: { 
        sessionId,
        seats: selectedSeats.map(s => s.id).join(',')
      }
    });
  };

  const onPinchGestureEvent = ({ nativeEvent }: any) => {
    scale.value = Math.min(Math.max(nativeEvent.scale, 0.5), 2);
  };

  const totalPrice = selectedSeats.reduce((total, seat) => {
    return total + getSeatPrice(session.price, seat.type);
  }, 0);

  const priceBreakdown = selectedSeats.reduce((acc, seat) => {
    acc[seat.type] = (acc[seat.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sessão não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        maximumZoomScale={2}
        minimumZoomScale={0.5}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Selecione seus assentos</Text>
          <Text style={styles.subtitle}>
            Máximo de {MAX_SEATS} assentos por compra
          </Text>
        </View>
        
        <View style={styles.screen}>
          <Text style={styles.screenText}>TELA</Text>
        </View>

        <View style={styles.seatsContainer}>
          {Object.entries(seatsByRow).map(([row, seats]) => (
            <View key={row} style={styles.row}>
              <Text style={styles.rowLabel}>{row}</Text>
              <View style={styles.rowSeats}>
                {seats.map(seat => (
                  <Seat 
                    key={seat.id} 
                    seat={seat} 
                    onPress={() => handleSeatPress(seat)}
                    disabled={selectedSeats.length >= MAX_SEATS && seat.status !== 'selected'}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <IconButton icon="seat-outline" size={20} iconColor="#fff" />
            <Text style={styles.legendText}>Standard (R$ {session.price.toFixed(2)})</Text>
          </View>
          <View style={styles.legendItem}>
            <IconButton icon="seat-outline" size={20} iconColor="#FFD700" />
            <Text style={styles.legendText}>VIP (R$ {(session.price * 1.5).toFixed(2)})</Text>
          </View>
          <View style={styles.legendItem}>
            <IconButton icon="seat-outline" size={20} iconColor="#00FF00" />
            <Text style={styles.legendText}>IMAX (R$ {(session.price * 2).toFixed(2)})</Text>
          </View>
          <View style={styles.legendItem}>
            <IconButton icon="seat-outline" size={20} iconColor="#FF69B4" />
            <Text style={styles.legendText}>Casal (R$ {(session.price * 2.5).toFixed(2)})</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.selectedText}>
              {selectedSeats.length} assento{selectedSeats.length !== 1 ? 's' : ''} selecionado{selectedSeats.length !== 1 ? 's' : ''}
            </Text>
            {Object.entries(priceBreakdown).length > 0 && (
              <View style={styles.priceBreakdown}>
                {Object.entries(priceBreakdown).map(([type, count]) => (
                  <Text key={type} style={styles.priceBreakdownText}>
                    {count}x {type}: R$ {(getSeatPrice(session.price, type as Seat['type']) * count).toFixed(2)}
                  </Text>
                ))}
              </View>
            )}
            <Text style={styles.priceText}>
              Total: R$ {totalPrice.toFixed(2)}
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={handleConfirm}
            disabled={selectedSeats.length === 0}
            buttonColor="#E50914"
            textColor="#fff"
          >
            Confirmar
          </Button>
        </View>
      </View>

      <Portal>
        <Modal
          visible={showMaxSeatsModal}
          onDismiss={() => setShowMaxSeatsModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Limite de assentos</Text>
          <Text style={styles.modalText}>
            Você pode selecionar no máximo {MAX_SEATS} assentos por compra.
          </Text>
          <Button
            mode="contained"
            onPress={() => setShowMaxSeatsModal(false)}
            buttonColor="#E50914"
            textColor="#fff"
          >
            Entendi
          </Button>
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
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  screen: {
    width: '80%',
    height: 8,
    backgroundColor: '#E50914',
    alignSelf: 'center',
    borderRadius: 4,
    marginBottom: 32,
  },
  screenText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  seatsContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rowLabel: {
    color: '#666',
    fontSize: 12,
    width: 20,
    textAlign: 'center',
  },
  rowSeats: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8
  },
  seatWrapper: {
    alignItems: 'center',
    width: 32,
  },
  seatText: {
    color: '#fff',
    fontSize: 10,
    marginTop: -8,
  },
  seatTextDisabled: {
    color: '#666',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    color: '#fff',
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    padding: 16,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  priceText: {
    color: '#E50914',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modal: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 24,
  },
  seatTextVip: {
    color: '#FFD700',
  },
  priceBreakdown: {
    marginTop: 4,
  },
  priceBreakdownText: {
    color: '#999',
    fontSize: 12,
  }
}); 