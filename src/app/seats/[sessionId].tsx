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

  return (
    <Animated.View style={[styles.seatWrapper, animatedStyle]}>
      <IconButton
        icon={seat.status === 'occupied' ? 'seat' : 'seat-outline'}
        size={24}
        disabled={seat.status === 'occupied' || disabled}
        onPress={handlePress}
        iconColor={
          seat.status === 'selected' ? '#E50914' :
          seat.status === 'occupied' ? '#666' : '#fff'
        }
      />
      <Text style={[
        styles.seatText,
        seat.status === 'occupied' && styles.seatTextDisabled
      ]}>
        {seat.row}{seat.number}
      </Text>
    </Animated.View>
  );
});

// Função para gerar assentos mock
const generateSeats = (): Record<string, Seat[]> => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12; // Aumentado para 12 assentos por fileira
  const seatsByRow: Record<string, Seat[]> = {};

  rows.forEach(row => {
    seatsByRow[row] = [];
    for (let i = 1; i <= seatsPerRow; i++) {
      // Cria um corredor no meio (entre os assentos 6 e 7)
      if (i === 7) {
        seatsByRow[row].push({
          id: `${row}${i}`,
          row,
          number: i,
          status: 'occupied' // Usa 'occupied' para criar o corredor
        });
      } else {
        seatsByRow[row].push({
          id: `${row}${i}`,
          row,
          number: i,
          // Alguns assentos aleatórios ocupados, mas menos frequentes
          status: Math.random() > 0.9 ? 'occupied' : 'available'
        });
      }
    }
  });

  return seatsByRow;
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

  const totalPrice = selectedSeats.length * session.price;

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
            <Text style={styles.legendText}>Disponível</Text>
          </View>
          <View style={styles.legendItem}>
            <IconButton icon="seat" size={20} iconColor="#E50914" />
            <Text style={styles.legendText}>Selecionado</Text>
          </View>
          <View style={styles.legendItem}>
            <IconButton icon="seat" size={20} iconColor="#666" />
            <Text style={styles.legendText}>Ocupado</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.selectedText}>
              {selectedSeats.length} assento{selectedSeats.length !== 1 ? 's' : ''} selecionado{selectedSeats.length !== 1 ? 's' : ''}
            </Text>
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
  }
}); 