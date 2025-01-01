import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { colors } from '@/core/theme/colors';
import { PurchaseSummary } from './PurchaseSummary';
import { PaymentMethods } from './PaymentMethods';
import { Header } from '../../../shared/components/Header';
import { styles } from './styles/payment-screen.styles';

const PAYMENT_METHODS = [
  { id: 'credit', label: 'Cartão de Crédito', icon: 'credit-card' },
  { id: 'pix', label: 'PIX', icon: 'qrcode' },
  { id: 'boleto', label: 'Boleto', icon: 'barcode' },
] as const;

export function PaymentScreen() {
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

  const handlePayment = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    clearSelectedSeats();
    router.push('/(stack)/success');
  };

  if (!currentSession || selectedSeats.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Pagamento"
        variant="transparent"
        alignment="center"
      />

      <SafeAreaView style={styles.content} edges={['bottom']}>
        <ScrollView 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <PurchaseSummary 
            currentSession={currentSession}
            selectedSeats={selectedSeats}
            getTotalPrice={getTotalPrice}
          />

          <PaymentMethods
            selectedMethod={selectedMethod}
            onSelectMethod={setSelectedMethod}
          />
        </ScrollView>

        <LinearGradient
          colors={colors.gradients.surface}
          style={styles.footerGradient}
        >
          <View style={styles.footer}>
            <View style={styles.priceInfo}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>
                R$ {(getTotalPrice() * 1.1).toFixed(2)}
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
            </Pressable>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
} 