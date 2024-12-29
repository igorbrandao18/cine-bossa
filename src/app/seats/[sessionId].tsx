import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Portal, Modal, Text, Card, Chip, Divider } from 'react-native-paper';
import { useSessionStore } from '../../stores/sessionStore';
import { SeatComponent } from '../../components/seats/SeatComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Seat,
  SEAT_TYPES,
  ROOM_FEATURES,
  DISCOUNTS,
  WEEKDAYS
} from '../../types/seats';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
          const type = row < 2 ? 'vip' : 
                      row === 2 ? 'imax' :
                      col >= 6 ? 'couple' : 'standard';
          generatedSeats.push({
            id: seatId,
            row: String(row + 1),
            number: col + 1,
            type,
            status: Math.random() > 0.8 ? 'occupied' : 'available'
          });
        }
      }
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
    
    // Desconto por quantidade
    if (selectedSeats.length >= 6) {
      discounts.push(DISCOUNTS.quantity[6]);
    } else if (selectedSeats.length >= 4) {
      discounts.push(DISCOUNTS.quantity[4]);
    } else if (selectedSeats.length >= 2) {
      discounts.push(DISCOUNTS.quantity[2]);
    }

    // Desconto por pacote
    const hasVip = selectedSeats.some(seat => seat.type === 'vip');
    const hasCouple = selectedSeats.some(seat => seat.type === 'couple');
    const hasImax = selectedSeats.some(seat => seat.type === 'imax');

    if (hasVip && hasCouple) {
      discounts.push(DISCOUNTS.package.vipCouple);
    }
    if (hasVip && hasImax) {
      discounts.push(DISCOUNTS.package.imaxVip);
    }

    // Desconto por dia da semana
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

        <View style={styles.seatsGrid}>
          {seats.map(seat => (
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

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, { backgroundColor: SEAT_TYPES.standard.color }]} />
          <Text style={styles.legendText}>Standard</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, { backgroundColor: SEAT_TYPES.vip.color }]} />
          <Text style={styles.legendText}>VIP</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, { backgroundColor: SEAT_TYPES.imax.color }]} />
          <Text style={styles.legendText}>IMAX</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, { backgroundColor: SEAT_TYPES.couple.color }]} />
          <Text style={styles.legendText}>Casal</Text>
        </View>
      </View>
    </>
  );

  const renderInfo = () => (
    <View style={styles.infoContainer}>
      {Object.entries(SEAT_TYPES).map(([type, info]) => (
        <Card key={type} style={styles.infoCard}>
          <Card.Title
            title={info.title}
            subtitle={`Multiplicador: ${info.priceMultiplier}x`}
            left={(props) => (
              <View style={[styles.cardIcon, { backgroundColor: info.color }]} />
            )}
          />
          <Card.Content>
            <Text style={styles.cardDescription}>{info.description}</Text>
            <View style={styles.benefitsList}>
              {info.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <MaterialCommunityIcons name="check-circle" size={18} color="#E50914" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      ))}

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
    </View>
  );

  return (
    <ScrollView style={styles.container}>
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

      <View style={styles.footer}>
        {selectedSeats.length > 0 && (
          <View style={styles.discountsContainer}>
            <Text style={styles.discountsTitle}>Descontos Aplicáveis:</Text>
            <View style={styles.discountsList}>
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
            </View>
          </View>
        )}
        
        <Divider style={styles.divider} />
        
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Total:</Text>
          <Text style={styles.priceValue}>
            R$ {calculateTotal().toFixed(2)}
          </Text>
        </View>
        
        <Button
          mode="contained"
          onPress={handleConfirmSelection}
          disabled={selectedSeats.length === 0}
          buttonColor="#E50914"
          textColor="#fff"
          style={styles.confirmButton}
        >
          Confirmar Seleção ({selectedSeats.length})
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showConfirmModal}
          onDismiss={() => setShowConfirmModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Confirmar Seleção</Text>
          <Text style={styles.modalText}>
            Você selecionou {selectedSeats.length} assento(s).
            {'\n'}Total: R$ {calculateTotal().toFixed(2)}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  seatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    padding: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    color: '#999',
    fontSize: 14,
  },
  infoContainer: {
    padding: 16,
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    marginBottom: 16,
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  cardDescription: {
    color: '#ccc',
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    color: '#ccc',
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  discountsContainer: {
    marginBottom: 16,
  },
  discountsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  discountsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  discountChip: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    borderColor: '#E50914',
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
  },
  divider: {
    backgroundColor: '#333',
    marginVertical: 16,
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 18,
    color: '#fff',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E50914',
  },
  confirmButton: {
    width: '100%',
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
  }
}); 