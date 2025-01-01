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
                <Text style={styles.sessionDetails}>
                  {currentSession.room} • {currentSession.technology} • {currentSession.time}
                </Text>
              </View>
              
              <View style={styles.seatsInfo}>
                <Text style={styles.seatsLabel}>Assentos selecionados:</Text>
                <View style={styles.seatsGrid}>
                  {selectedSeats.map(seatId => {
                    const seat = currentSession.seats.find(s => s.id === seatId);
                    return (
                      <View key={seatId} style={styles.seatBadge}>
                        <Text style={styles.seatText}>
                          {seat?.row}{seat?.number}
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
                  <Text style={styles.priceLabel}>Taxa de serviço</Text>
                  <Text style={styles.priceValue}>R$ 0,00</Text>
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
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
  },
  movieTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  seatsInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  seatBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  seatText: {
    color: '#fff',
    fontSize: 14,
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
  movieInfo: {
    marginBottom: 16,
  },
  sessionDetails: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  seatsLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  seatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priceBreakdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
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
  payButtonDisabled: {
    opacity: 0.7,
  },
}); 