import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { colors } from '@/core/theme/colors';

const PAYMENT_METHODS = [
  { id: 'credit', label: 'Cartão de Crédito', icon: 'credit-card' },
  { id: 'pix', label: 'PIX', icon: 'qrcode' },
  { id: 'boleto', label: 'Boleto', icon: 'barcode' },
] as const;

export function PaymentScreen() {
  const router = useRouter();
  const { currentSession, selectedSeats, clearSelectedSeats } = useSessionStore();
  const [selectedMethod, setSelectedMethod] = useState<typeof PAYMENT_METHODS[number]['id']>('credit');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentSession || selectedSeats.length === 0) {
      router.back();
    }
    return () => {
      clearSelectedSeats();
    };
  }, [currentSession, selectedSeats.length]);

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = currentSession?.seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const getSelectedSeatsInfo = () => {
    return selectedSeats.map(seatId => {
      const seat = currentSession?.seats.find(s => s.id === seatId);
      return seat ? `${seat.row}${seat.number}` : '';
    }).join(', ');
  };

  const handlePayment = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    clearSelectedSeats(); // Clear seats after successful payment
    router.push('/(stack)/success');
  };

  if (!currentSession || selectedSeats.length === 0) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="chevron-left"
            iconColor={colors.text}
            size={24}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Pagamento</Text>
            <Text style={styles.subtitle}>
              {currentSession.room} • {currentSession.time}
            </Text>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Resumo */}
          <View style={styles.summary}>
            <Text style={styles.sectionTitle}>Resumo da Compra</Text>
            <View style={styles.summaryContent}>
              <View style={styles.movieInfo}>
                <Text style={styles.movieTitle}>{currentSession.movieTitle}</Text>
                <View style={styles.sessionDetails}>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="calendar" size={16} color={colors.textSecondary} />
                    <Text style={styles.sessionDetailsText}>{currentSession.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.sessionDetailsText}>{currentSession.time}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="door" size={16} color={colors.textSecondary} />
                    <Text style={styles.sessionDetailsText}>{currentSession.room}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="video" size={16} color={colors.textSecondary} />
                    <Text style={styles.sessionDetailsText}>{currentSession.technology}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.seatsInfo}>
                <Text style={styles.seatsLabel}>Assentos selecionados</Text>
                <View style={styles.seatsGrid}>
                  {selectedSeats.map(seatId => {
                    const seat = currentSession.seats.find(s => s.id === seatId);
                    if (!seat) return null;
                    
                    return (
                      <View key={seatId} style={styles.seatCard}>
                        <View style={styles.seatBadge}>
                          <Text style={styles.seatText}>
                            {seat.row}{seat.number}
                          </Text>
                        </View>
                        <Text style={styles.seatType}>
                          {seat.type === 'couple' ? 'Namorados' :
                           seat.type === 'premium' ? 'Premium' :
                           seat.type === 'wheelchair' ? 'Acessível' : 'Padrão'}
                        </Text>
                        <Text style={styles.seatPrice}>
                          R$ {seat.price.toFixed(2)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Ingressos ({selectedSeats.length}x)</Text>
                  <Text style={styles.priceValue}>R$ {getTotalPrice().toFixed(2)}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Taxa de conveniência</Text>
                  <Text style={styles.priceValue}>R$ {(getTotalPrice() * 0.1).toFixed(2)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    R$ {(getTotalPrice() * 1.1).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Métodos de Pagamento */}
          <View style={styles.paymentMethods}>
            <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
            <View style={styles.methodsGrid}>
              {PAYMENT_METHODS.map(method => (
                <Pressable
                  key={method.id}
                  style={[
                    styles.methodCard,
                    selectedMethod === method.id && styles.selectedMethod
                  ]}
                  onPress={() => setSelectedMethod(method.id)}
                >
                  <MaterialCommunityIcons
                    name={method.icon}
                    size={24}
                    color={selectedMethod === method.id ? '#E50914' : '#fff'}
                  />
                  <Text style={[
                    styles.methodLabel,
                    selectedMethod === method.id && styles.selectedMethodLabel
                  ]}>
                    {method.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {selectedMethod === 'credit' && (
              <View style={styles.creditCardForm}>
                <TextInput
                  mode="outlined"
                  label="Número do Cartão"
                  style={styles.input}
                  theme={{ colors: { primary: '#E50914' } }}
                />
                <View style={styles.row}>
                  <TextInput
                    mode="outlined"
                    label="Validade"
                    style={[styles.input, styles.halfInput]}
                    theme={{ colors: { primary: '#E50914' } }}
                  />
                  <TextInput
                    mode="outlined"
                    label="CVV"
                    style={[styles.input, styles.halfInput]}
                    theme={{ colors: { primary: '#E50914' } }}
                  />
                </View>
                <TextInput
                  mode="outlined"
                  label="Nome no Cartão"
                  style={styles.input}
                  theme={{ colors: { primary: '#E50914' } }}
                />
              </View>
            )}

            {selectedMethod === 'pix' && (
              <View style={styles.pixContainer}>
                <View style={styles.qrCodePlaceholder}>
                  <MaterialCommunityIcons name="qrcode" size={100} color="#fff" />
                </View>
                <Text style={styles.pixInstructions}>
                  Escaneie o QR Code para pagar
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <LinearGradient
          colors={colors.gradients.surface}
          style={styles.footerGradient}
        >
          <View style={styles.footer}>
            <View style={styles.priceInfo}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>
                R$ {getTotalPrice().toFixed(2)}
              </Text>
            </View>
            <Pressable
              style={[
                styles.payButton,
                loading && styles.payButtonDisabled
              ]}
              onPress={handlePayment}
              disabled={loading}
            >
              <Text style={styles.payButtonText}>
                {loading ? 'Processando...' : 'Finalizar Compra'}
              </Text>
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={20} 
                color={colors.text}
              />
            </Pressable>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  summary: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  summaryContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 24,
  },
  movieInfo: {
    gap: 12,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  sessionDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionDetailsText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  seatsInfo: {
    gap: 12,
  },
  seatsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  seatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  seatCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    minWidth: 100,
  },
  seatBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  seatText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  seatType: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  seatPrice: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  priceBreakdown: {
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  priceValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  totalRow: {
    marginTop: 4,
  },
  totalLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  paymentMethods: {
    marginBottom: 24,
  },
  methodsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  methodCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  selectedMethod: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    borderWidth: 1,
    borderColor: '#E50914',
  },
  methodLabel: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  selectedMethodLabel: {
    color: '#E50914',
  },
  creditCardForm: {
    gap: 16,
  },
  input: {
    backgroundColor: '#1A1A1A',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  pixContainer: {
    alignItems: 'center',
    padding: 24,
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pixInstructions: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  footerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInfo: {
    flex: 1,
  },
  totalLabel: {
    color: '#999',
    fontSize: 14,
  },
  totalPrice: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E50914',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
}); 