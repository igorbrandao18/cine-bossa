import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { useMovieDetails } from '@/features/movies/hooks/useMovieDetails';
import { colors } from '@/core/theme/colors';
import { PurchaseSummary } from './PurchaseSummary';
import { PaymentMethods } from './PaymentMethods';
import { Header } from '../../../shared/components/Header';
import { styles } from './styles/payment-screen.styles';
import type { Session, Seat } from '@/features/sessions/types/session';

const PAYMENT_METHODS = [
  { id: 'credit', label: 'Cartão de Crédito', icon: 'credit-card' },
  { id: 'pix', label: 'PIX', icon: 'qrcode' },
  { id: 'debit', label: 'Cartão de Débito', icon: 'credit-card-outline' },
] as const;

type PaymentMethodId = typeof PAYMENT_METHODS[number]['id'];

export function PaymentScreen() {
  const { currentSession, selectedSeats, clearSelectedSeats } = useSessionStore();
  const { addTicket } = useTicketStore();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('credit');
  const [loading, setLoading] = useState(false);

  // Carrega os detalhes do filme para obter o poster_path
  const { movie } = useMovieDetails(Number(currentSession?.movieId));

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

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId as PaymentMethodId);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Simula o processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!currentSession || !movie) return;

      // Cria o novo ingresso
      await addTicket({
        movieId: Number(currentSession.movieId),
        movieTitle: currentSession.movieTitle,
        posterPath: movie.poster_path,
        date: currentSession.date,
        time: currentSession.time,
        room: currentSession.room,
        seats: selectedSeats.map(seatId => {
          const seat = currentSession.seats.find(s => s.id === seatId);
          return `${seat?.row}${seat?.number}`;
        }),
        price: getTotalPrice() * 1.1, // Inclui a taxa de serviço
        userId: 'user123', // Você deve pegar o ID do usuário atual
        sessionId: currentSession.id,
        purchaseDate: new Date().toISOString(),
      });

      clearSelectedSeats();
      // Navega para a tela de ingressos após o sucesso
      router.push('/tickets');
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      // Aqui você pode adicionar um tratamento de erro adequado
    } finally {
      setLoading(false);
    }
  };

  if (!currentSession || selectedSeats.length === 0) {
    return null;
  }

  const sessionWithStatus: Session = {
    id: currentSession.id,
    movieId: Number(currentSession.movieId),
    movieTitle: currentSession.movieTitle,
    date: currentSession.date,
    time: currentSession.time,
    room: currentSession.room,
    price: currentSession.price,
    status: 'scheduled',
    technology: currentSession.technology,
    seats: currentSession.seats.map(seat => ({
      id: seat.id,
      row: seat.row,
      number: seat.number,
      status: (seat.status === 'selected' ? 'reserved' : seat.status) as Seat['status'],
      type: (seat.type === 'couple' ? 'companion' : 
             seat.type === 'premium' ? 'standard' : seat.type) as Seat['type'],
      price: seat.price
    }))
  };

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
            currentSession={sessionWithStatus}
            selectedSeats={selectedSeats}
            getTotalPrice={getTotalPrice}
          />

          <PaymentMethods
            selectedMethod={selectedMethod}
            onSelectMethod={handleMethodSelect}
            totalPrice={getTotalPrice() * 1.1}
            onFinishPurchase={handlePayment}
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