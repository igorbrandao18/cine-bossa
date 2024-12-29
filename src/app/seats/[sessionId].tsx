import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Vibration, Dimensions, Pressable } from 'react-native';
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
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const MAX_SEATS = 6;

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'selected';
  type: 'standard' | 'vip' | 'imax' | 'couple';
}

interface SeatTypeInfo {
  title: string;
  description: string;
  benefits: string[];
  color: string;
  priceMultiplier: number;
}

const SEAT_TYPES: Record<Seat['type'], SeatTypeInfo> = {
  standard: {
    title: 'Standard',
    description: 'Assento tradicional com todo o conforto necessário',
    benefits: [
      'Assento reclinável',
      'Suporte para copos',
      'Visão privilegiada da tela'
    ],
    color: '#fff',
    priceMultiplier: 1
  },
  vip: {
    title: 'VIP',
    description: 'Experiência premium com mais espaço e conforto',
    benefits: [
      'Assento mais largo e reclinável',
      'Apoio para pernas',
      'Localização central da sala',
      'Serviço de comidas e bebidas'
    ],
    color: '#FFD700',
    priceMultiplier: 1.5
  },
  imax: {
    title: 'IMAX',
    description: 'A melhor experiência audiovisual do cinema',
    benefits: [
      'Tela gigante IMAX',
      'Som imersivo',
      'Assentos premium',
      'Ângulo perfeito de visão',
      'Tecnologia 3D aprimorada'
    ],
    color: '#00FF00',
    priceMultiplier: 2
  },
  couple: {
    title: 'Casal',
    description: 'Assentos especiais para momentos românticos',
    benefits: [
      'Assento duplo sem divisória',
      'Apoio de braço retrátil',
      'Maior privacidade',
      'Localização especial na sala'
    ],
    color: '#FF69B4',
    priceMultiplier: 2.5
  }
};

const SEAT_INFO_SECTIONS = {
  screen: {
    title: 'TELA IMAX',
    subtitle: 'Projeção Digital 4K HDR',
    specs: ['Som Dolby Atmos', '26m x 14m', 'Tela Curva']
  },
  room: {
    title: 'SALA VIP 3',
    subtitle: 'Capacidade: 160 lugares',
    features: ['Ar Condicionado', 'Som Imersivo', 'Poltronas Reclináveis']
  }
};

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

// Tipos de descontos disponíveis
const DISCOUNTS = {
  quantity: {
    6: { value: 0.15, label: 'Super Combo: 15% na compra de 6 ou mais ingressos' },
    4: { value: 0.10, label: 'Combo Amigos: 10% na compra de 4-5 ingressos' },
    2: { value: 0.05, label: 'Combo Duplo: 5% na compra de 2-3 ingressos' },
  },
  package: {
    vipCouple: { 
      value: 0.20, 
      label: 'Combo Romântico VIP: 20% de desconto nos assentos VIP + Casal' 
    },
    imaxVip: { 
      value: 0.15, 
      label: 'Combo Premium: 15% de desconto nos assentos IMAX + VIP' 
    },
  },
  weekday: {
    monday: { value: 0.25, label: 'Super Segunda: 25% em todos os assentos' },
    tuesday: { value: 0.25, label: 'Terça Imperdível: 25% em todos os assentos' },
    wednesday: { value: 0.15, label: 'Quarta Promo: 15% em todos os assentos' },
  }
};

const WEEKDAYS = {
  0: { id: 'sunday', label: 'Domingo' },
  1: { id: 'monday', label: 'Segunda-feira' },
  2: { id: 'tuesday', label: 'Terça-feira' },
  3: { id: 'wednesday', label: 'Quarta-feira' },
  4: { id: 'thursday', label: 'Quinta-feira' },
  5: { id: 'friday', label: 'Sexta-feira' },
  6: { id: 'saturday', label: 'Sábado' }
} as const;

// Função para calcular descontos
const calculateDiscount = (seats: Seat[], date: Date): { 
  discount: number; 
  type: string;
  description: string;
} => {
  let maxDiscount = 0;
  let discountType = '';
  let description = '';

  // Desconto por quantidade
  const totalSeats = seats.length;
  Object.entries(DISCOUNTS.quantity).forEach(([quantity, info]) => {
    if (totalSeats >= Number(quantity) && info.value > maxDiscount) {
      maxDiscount = info.value;
      discountType = 'quantity';
      description = info.label;
    }
  });

  // Desconto por pacote
  const hasVip = seats.some(s => s.type === 'vip');
  const hasCouple = seats.some(s => s.type === 'couple');
  const hasImax = seats.some(s => s.type === 'imax');

  if (hasVip && hasCouple && DISCOUNTS.package.vipCouple.value > maxDiscount) {
    maxDiscount = DISCOUNTS.package.vipCouple.value;
    discountType = 'package';
    description = DISCOUNTS.package.vipCouple.label;
  } else if (hasImax && hasVip && DISCOUNTS.package.imaxVip.value > maxDiscount) {
    maxDiscount = DISCOUNTS.package.imaxVip.value;
    discountType = 'package';
    description = DISCOUNTS.package.imaxVip.label;
  }

  // Desconto por dia da semana
  const weekday = WEEKDAYS[date.getDay()];
  const weekdayDiscount = DISCOUNTS.weekday[weekday.id as keyof typeof DISCOUNTS.weekday];
  
  if (weekdayDiscount && weekdayDiscount.value > maxDiscount) {
    maxDiscount = weekdayDiscount.value;
    discountType = 'weekday';
    description = weekdayDiscount.label;
  }

  return { discount: maxDiscount, type: discountType, description };
};

const ROOM_FEATURES = {
  comfort: {
    icon: 'seat-recline-extra',
    title: 'Conforto Premium',
    items: [
      'Poltronas reclináveis 180°',
      'Apoio de pernas elétrico',
      'Espaço extra entre fileiras'
    ]
  },
  sound: {
    icon: 'surround-sound',
    title: 'Som Imersivo',
    items: [
      'Dolby Atmos 3D',
      '64 canais de áudio',
      'Subwoofers dedicados'
    ]
  },
  screen: {
    icon: 'television',
    title: 'Projeção IMAX',
    items: [
      'Resolução 4K HDR',
      'Tela curva de 26m',
      'Brilho de 14fL'
    ]
  },
  extras: {
    icon: 'star',
    title: 'Diferenciais',
    items: [
      'Ar condicionado individual',
      'Serviço de snacks',
      'Carregadores USB'
    ]
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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedType, setSelectedType] = useState<Seat['type'] | null>(null);

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

  // Simulando uma data para a sessão (Segunda-feira)
  const sessionDate = new Date(2024, 2, 18); // 18 de Março de 2024 (Segunda-feira)
  const { discount, description: discountDescription } = calculateDiscount(selectedSeats, sessionDate);
  const subtotal = selectedSeats.reduce((total, seat) => {
    return total + getSeatPrice(session.price, seat.type);
  }, 0);
  const totalPrice = subtotal * (1 - discount);

  const priceBreakdown = selectedSeats.reduce((acc, seat) => {
    acc[seat.type] = (acc[seat.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const showSeatInfo = (type: Seat['type']) => {
    setSelectedType(type);
    setShowInfoModal(true);
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sessão não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.roomInfo}>
          <Text style={styles.roomTitle}>{SEAT_INFO_SECTIONS.room.title}</Text>
          <Text style={styles.roomSubtitle}>{SEAT_INFO_SECTIONS.room.subtitle}</Text>
          
          <View style={styles.featuresGrid}>
            {Object.entries(ROOM_FEATURES).map(([key, feature]) => (
              <View key={key} style={styles.featureCard}>
                <MaterialCommunityIcons 
                  name={feature.icon} 
                  size={24} 
                  color="#E50914" 
                />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <View style={styles.featureList}>
                  {feature.items.map((item, index) => (
                    <Text key={index} style={styles.featureItem}>
                      • {item}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.screenContainer}>
          <View style={styles.screenSpecs}>
            {SEAT_INFO_SECTIONS.screen.specs.map(spec => (
              <Text key={spec} style={styles.specText}>{spec}</Text>
            ))}
          </View>
          <View style={styles.screen}>
            <LinearGradient
              colors={['#E50914', '#FF443A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.screenGradient}
            />
          </View>
          <Text style={styles.screenText}>{SEAT_INFO_SECTIONS.screen.title}</Text>
          <Text style={styles.screenSubtext}>{SEAT_INFO_SECTIONS.screen.subtitle}</Text>
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
          {Object.entries(SEAT_TYPES).map(([type, info]) => (
            <Pressable 
              key={type}
              onPress={() => showSeatInfo(type as Seat['type'])}
              style={styles.legendItem}
            >
              <IconButton 
                icon="seat-outline" 
                size={20} 
                iconColor={info.color}
              />
              <Text style={styles.legendText}>
                {info.title} (R$ {(session.price * info.priceMultiplier).toFixed(2)})
              </Text>
            </Pressable>
          ))}
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
                    {count}x {SEAT_TYPES[type as Seat['type']].title}: R$ {(getSeatPrice(session.price, type as Seat['type']) * count).toFixed(2)}
                  </Text>
                ))}
                {discount > 0 && (
                  <>
                    <Text style={styles.discountText}>
                      {discountDescription}
                    </Text>
                    <Text style={styles.discountValue}>
                      -R$ {(subtotal * discount).toFixed(2)}
                    </Text>
                  </>
                )}
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

        <Modal
          visible={showInfoModal}
          onDismiss={() => setShowInfoModal(false)}
          contentContainerStyle={styles.modal}
        >
          {selectedType && (
            <>
              <Text style={styles.modalTitle}>{SEAT_TYPES[selectedType].title}</Text>
              <Text style={styles.modalDescription}>
                {SEAT_TYPES[selectedType].description}
              </Text>
              <Text style={styles.benefitsTitle}>Benefícios:</Text>
              {SEAT_TYPES[selectedType].benefits.map((benefit, index) => (
                <Text key={index} style={styles.benefitItem}>
                  • {benefit}
                </Text>
              ))}
              <Button
                mode="contained"
                onPress={() => setShowInfoModal(false)}
                buttonColor="#E50914"
                textColor="#fff"
                style={styles.modalButton}
              >
                Entendi
              </Button>
            </>
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
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    height: 36,
  },
  seatText: {
    color: '#fff',
    fontSize: 10,
    marginTop: -14,
    textAlign: 'center',
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
    paddingTop: 12,
    paddingBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 4,
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
    marginTop: 4,
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
    marginTop: 0,
    marginBottom: 4,
  },
  priceBreakdownText: {
    color: '#999',
    fontSize: 12,
    lineHeight: 18,
  },
  modalDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
    paddingLeft: 8,
  },
  modalButton: {
    marginTop: 20,
  },
  discountText: {
    color: '#4CAF50',
    fontSize: 12,
    marginTop: 2,
  },
  discountValue: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  roomInfo: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  roomSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  roomFeatures: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    color: '#999',
    fontSize: 12,
  },
  screenContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  screenSpecs: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  specText: {
    color: '#666',
    fontSize: 12,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  screen: {
    width: '80%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  screenGradient: {
    flex: 1,
  },
  screenText: {
    color: '#E50914',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  screenSubtext: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#262626',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  featureTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureList: {
    width: '100%',
  },
  featureItem: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
}); 