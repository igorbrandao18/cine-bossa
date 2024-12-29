import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Portal, Modal, Text, Card, Chip, Divider, Surface } from 'react-native-paper';
import { useSessionStore } from '../../features/sessions/stores/sessionStore';
import { SeatComponent } from '../../features/seats/components/SeatComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Seat,
  SEAT_TYPES,
  ROOM_FEATURES,
  DISCOUNTS,
  WEEKDAYS
} from '../../features/seats/types/seats';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLUMNS = 12;
const COLUMNS_PER_SECTION = 6; // 6 assentos de cada lado do corredor

const SEAT_TYPES_BY_POSITION = (row: string, col: number): keyof typeof SEAT_TYPES => {
  // D-BOX nas primeiras duas fileiras
  if (row === 'A' || row === 'B') {
    return 'd-box';
  }
  
  // IMAX nas fileiras C e D, posições centrais
  if ((row === 'C' || row === 'D')) {
    // Posições centrais em cada seção
    if ((col >= 2 && col <= 5) || (col >= 8 && col <= 11)) {
      return 'imax';
    }
  }

  // Love Seats nas últimas fileiras, posições pares
  if ((row === 'G' || row === 'H')) {
    // Agrupa os assentos em pares em cada seção
    if (((col % 2 === 0) && col <= COLUMNS_PER_SECTION) || 
        ((col % 2 === 0) && col > COLUMNS_PER_SECTION)) {
      return 'couple';
    }
  }

  // VIP nas fileiras C-F, exceto posições IMAX
  if (row >= 'C' && row <= 'F') {
    // Posições laterais em cada seção
    if ((col <= 1 || col >= 6) && col <= COLUMNS_PER_SECTION) {
      return 'vip';
    }
    if ((col <= 7 || col >= 12) && col > COLUMNS_PER_SECTION) {
      return 'vip';
    }
  }

  // Standard para o resto
  return 'standard';
};

export default function SeatsScreen() {
  const { sessionId } = useLocalSearchParams();
  const router = useRouter();
  const session = useSessionStore(state => 
    state.sessions.find(s => s.id === sessionId)
  );
  
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'info'>('map');

  useEffect(() => {
    if (session) {
      const generatedSeats: Seat[] = [];
      ROWS.forEach((rowLetter) => {
        for (let col = 1; col <= COLUMNS; col++) {
          const seatId = `${rowLetter}${col.toString().padStart(2, '0')}`;
          const type = SEAT_TYPES_BY_POSITION(rowLetter, col);
          generatedSeats.push({
            id: seatId,
            row: rowLetter,
            number: col,
            type,
            status: Math.random() > 0.85 ? 'occupied' : 'available'
          });
        }
      });
      setSeats(generatedSeats);
    }
  }, [session]);

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      const typeInfo = SEAT_TYPES[seat.type];
      return total + (session?.price || 0) * typeInfo.priceMultiplier;
    }, 0);
  };

  const getApplicableDiscounts = () => {
    const discounts = [];
    
    if (selectedSeats.length >= 6) {
      discounts.push(DISCOUNTS.quantity[6]);
    } else if (selectedSeats.length >= 4) {
      discounts.push(DISCOUNTS.quantity[4]);
    } else if (selectedSeats.length >= 2) {
      discounts.push(DISCOUNTS.quantity[2]);
    }

    const hasVip = selectedSeats.some(seat => seat.type === 'vip');
    const hasCouple = selectedSeats.some(seat => seat.type === 'couple');
    const hasImax = selectedSeats.some(seat => seat.type === 'imax');

    if (hasVip && hasCouple) {
      discounts.push(DISCOUNTS.package.vipCouple);
    }
    if (hasVip && hasImax) {
      discounts.push(DISCOUNTS.package.imaxVip);
    }

    const today = new Date().getDay() as keyof typeof WEEKDAYS;
    const weekday = WEEKDAYS[today].id as keyof typeof DISCOUNTS.weekday;
    if (DISCOUNTS.weekday[weekday]) {
      discounts.push(DISCOUNTS.weekday[weekday]);
    }

    return discounts;
  };

  const handleSeatPress = (seat: Seat) => {
    if (seat.status === 'occupied') return;

    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      }
      return [...prev, seat];
    });
  };

  const handleConfirmSelection = () => {
    if (selectedSeats.length === 0) return;
    setShowConfirmModal(true);
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sessão não encontrada</Text>
        <Button 
          mode="contained" 
          onPress={() => router.back()}
          buttonColor="#E50914"
          textColor="#fff"
        >
          Voltar
        </Button>
      </View>
    );
  }

  const renderSeatMap = () => (
    <>
      <View style={styles.seatsContainer}>
        <View style={styles.screen}>
          <Text style={styles.screenText}>TELA</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={styles.columnNumbers}>
              <View style={styles.rowLabel} />
              {Array.from({ length: COLUMNS_PER_SECTION }, (_, i) => (
                <Text key={i} style={styles.numberLabel}>
                  {(i + 1).toString().padStart(2, '0')}
                </Text>
              ))}
              <View style={styles.corridorLabel}>
                <MaterialCommunityIcons name="stairs" size={20} color="#666" />
              </View>
              {Array.from({ length: COLUMNS_PER_SECTION }, (_, i) => (
                <Text key={i + COLUMNS_PER_SECTION} style={styles.numberLabel}>
                  {(i + COLUMNS_PER_SECTION + 1).toString().padStart(2, '0')}
                </Text>
              ))}
            </View>

            {ROWS.map((rowLetter) => (
              <View key={rowLetter} style={styles.row}>
                <Text style={styles.rowLabel}>{rowLetter}</Text>
                <View style={styles.seatsRow}>
                  {seats
                    .filter(seat => seat.row === rowLetter && seat.number <= COLUMNS_PER_SECTION)
                    .map(seat => (
                      <SeatComponent
                        key={seat.id}
                        seat={seat}
                        selected={selectedSeats.some(s => s.id === seat.id)}
                        disabled={seat.status === 'occupied'}
                        onPress={() => handleSeatPress(seat)}
                      />
                    ))}
                  
                  <View style={styles.corridor} />

                  {seats
                    .filter(seat => seat.row === rowLetter && seat.number > COLUMNS_PER_SECTION)
                    .map(seat => (
                      <SeatComponent
                        key={seat.id}
                        seat={seat}
                        selected={selectedSeats.some(s => s.id === seat.id)}
                        disabled={seat.status === 'occupied'}
                        onPress={() => handleSeatPress(seat)}
                      />
                    ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendSection}>
          <Text style={styles.legendTitle}>Status dos Assentos:</Text>
          <View style={styles.legendGrid}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, { backgroundColor: '#333' }]} />
              <Text style={styles.legendText}>Disponível</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, { backgroundColor: '#E50914' }]} />
              <Text style={styles.legendText}>Selecionado</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, { backgroundColor: '#666' }]} />
              <Text style={styles.legendText}>Ocupado</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );

  const renderInfo = () => (
    <View style={styles.infoContainer}>
      <Card style={styles.infoCard}>
        <Card.Title title="Recursos da Sala" />
        <Card.Content>
          <View style={styles.featuresGrid}>
            {Object.entries(ROOM_FEATURES).map(([key, feature]) => (
              <View key={key} style={styles.featureItem}>
                <MaterialCommunityIcons 
                  name={feature.icon as keyof typeof MaterialCommunityIcons.glyphMap} 
                  size={24} 
                  color="#E50914" 
                />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <View style={styles.featureList}>
                  {feature.items.map((item, index) => (
                    <Text key={index} style={styles.featureText}>• {item}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Title title="Promoções e Descontos" />
        <Card.Content>
          <View style={styles.discountCategories}>
            <View style={styles.discountCategory}>
              <Text style={styles.discountCategoryTitle}>Por Quantidade</Text>
              {Object.entries(DISCOUNTS.quantity).reverse().map(([quantity, info]) => (
                <View key={quantity} style={styles.discountItem}>
                  <MaterialCommunityIcons name="ticket-percent" size={20} color="#E50914" />
                  <Text style={styles.discountText}>{info.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.discountCategory}>
              <Text style={styles.discountCategoryTitle}>Pacotes Especiais</Text>
              {Object.entries(DISCOUNTS.package).map(([key, info]) => (
                <View key={key} style={styles.discountItem}>
                  <MaterialCommunityIcons name="ticket-confirmation" size={20} color="#E50914" />
                  <Text style={styles.discountText}>{info.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.discountCategory}>
              <Text style={styles.discountCategoryTitle}>Dias da Semana</Text>
              {Object.entries(DISCOUNTS.weekday).map(([day, info]) => (
                <View key={day} style={styles.discountItem}>
                  <MaterialCommunityIcons name="calendar-check" size={20} color="#E50914" />
                  <Text style={styles.discountText}>{info.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Selecione seus assentos</Text>
          <Text style={styles.subtitle}>
            {session.room} • {session.time}
          </Text>
        </View>

        <View style={styles.tabs}>
          <Button
            mode={activeTab === 'map' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('map')}
            style={styles.tab}
            buttonColor={activeTab === 'map' ? '#E50914' : 'transparent'}
            textColor={activeTab === 'map' ? '#fff' : '#E50914'}
          >
            Mapa de Assentos
          </Button>
          <Button
            mode={activeTab === 'info' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('info')}
            style={styles.tab}
            buttonColor={activeTab === 'info' ? '#E50914' : 'transparent'}
            textColor={activeTab === 'info' ? '#fff' : '#E50914'}
          >
            Informações
          </Button>
        </View>

        {activeTab === 'map' ? renderSeatMap() : renderInfo()}
      </ScrollView>

      {selectedSeats.length > 0 && (
        <Surface style={styles.footer} elevation={4}>
          <View style={styles.discountsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getApplicableDiscounts().map((discount, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  textStyle={styles.discountText}
                  style={styles.discountChip}
                >
                  {discount.label}
                </Chip>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.footerContent}>
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>Total:</Text>
              <Text style={styles.priceValue}>
                R$ {calculateTotal().toFixed(2)}
              </Text>
            </View>
            
            <Button
              mode="contained"
              onPress={handleConfirmSelection}
              buttonColor="#E50914"
              textColor="#fff"
              style={styles.confirmButton}
            >
              Confirmar ({selectedSeats.length})
            </Button>
          </View>
        </Surface>
      )}

      <Portal>
        <Modal
          visible={showConfirmModal}
          onDismiss={() => setShowConfirmModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Confirmar Seleção</Text>
          <Text style={styles.modalText}>
            Você selecionou {selectedSeats.length} assento(s):
            {'\n'}{selectedSeats.map(s => s.id).join(', ')}
            {'\n\n'}Total: R$ {calculateTotal().toFixed(2)}
            {getApplicableDiscounts().length > 0 && (
              <>
                {'\n\n'}Descontos disponíveis:{'\n'}
                {getApplicableDiscounts().map(d => `• ${d.label}\n`)}
              </>
            )}
          </Text>
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowConfirmModal(false)}
              textColor="#E50914"
              style={styles.modalButton}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setShowConfirmModal(false);
                router.push('/checkout');
              }}
              buttonColor="#E50914"
              textColor="#fff"
              style={styles.modalButton}
            >
              Prosseguir
            </Button>
          </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  tab: {
    flex: 1,
  },
  seatsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  screen: {
    width: '80%',
    height: 40,
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  screenText: {
    color: '#fff',
    fontSize: 12,
  },
  columnNumbers: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 24,
  },
  numberLabel: {
    width: 40,
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: {
    width: 24,
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },
  seatsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  legend: {
    padding: 16,
    gap: 24,
  },
  legendSection: {
    gap: 12,
  },
  legendTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    minWidth: 150,
    marginBottom: 12,
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendInfo: {
    flex: 1,
  },
  legendText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  legendPrice: {
    color: '#E50914',
    fontSize: 12,
    marginTop: 2,
  },
  legendDescription: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  infoContainer: {
    padding: 16,
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureItem: {
    width: '45%',
    marginBottom: 16,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  featureList: {
    gap: 4,
  },
  featureText: {
    color: '#ccc',
    fontSize: 12,
  },
  discountCategories: {
    gap: 24,
  },
  discountCategory: {
    gap: 8,
  },
  discountCategoryTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  discountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountText: {
    color: '#ccc',
    flex: 1,
  },
  footer: {
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    padding: 16,
    gap: 12,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  discountsContainer: {
    marginBottom: 8,
  },
  discountChip: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    borderColor: '#E50914',
    marginRight: 8,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#999',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E50914',
  },
  confirmButton: {
    minWidth: 140,
  },
  modal: {
    backgroundColor: '#1a1a1a',
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    minWidth: 100,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  topLegend: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  legendItemCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 120,
  },
  legendInfoCompact: {
    flex: 1,
  },
  corridor: {
    width: 40,
    marginHorizontal: 8,
  },
  corridorLabel: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 