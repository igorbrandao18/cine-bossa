import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useTheme } from '@/shared/hooks/useTheme';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { useSeatStore } from '@/features/seats/stores/seatStore';
import LottieView from 'lottie-react-native';
import { rem } from '@/shared/utils/rem';
import { useRouter } from 'expo-router';

interface PurchaseConfirmationProps {
  sessionId: string;
}

export function PurchaseConfirmation({ sessionId }: PurchaseConfirmationProps) {
  const theme = useTheme();
  const router = useRouter();
  const { selectedSeats, totalPrice } = useSeatStore();
  const { currentSession } = useSessionStore();

  const handleFinishPurchase = () => {
    // Aqui você implementaria a lógica de finalização da compra
    router.push('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('@/assets/animations/success.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      
      <Text variant="headlineMedium" style={styles.title}>
        Confirmação da Compra
      </Text>

      <View style={styles.infoContainer}>
        <Text variant="titleMedium" style={styles.movieTitle}>
          {currentSession?.movie.title}
        </Text>
        
        <Text style={styles.info}>
          Assentos: {selectedSeats.map(seat => seat.number).join(', ')}
        </Text>
        
        <Text style={styles.info}>
          Data: {new Date(currentSession?.date || '').toLocaleDateString()}
        </Text>
        
        <Text style={styles.info}>
          Horário: {currentSession?.time}
        </Text>

        <Text style={[styles.total, { color: theme.colors.primary }]}>
          Total: R$ {totalPrice.toFixed(2)}
        </Text>
      </View>

      <Button
        mode="contained"
        style={styles.button}
        onPress={handleFinishPurchase}
      >
        Finalizar Compra
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: rem(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: rem(12),
    height: rem(12),
  },
  title: {
    marginBottom: rem(2),
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    padding: rem(1.5),
    borderRadius: rem(1),
    marginBottom: rem(2),
  },
  movieTitle: {
    marginBottom: rem(1),
  },
  info: {
    marginBottom: rem(0.5),
  },
  total: {
    marginTop: rem(1),
    fontSize: rem(1.25),
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    marginTop: rem(2),
  },
}); 