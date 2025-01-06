import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/shared/components/Button';
import { theme, rem } from '@/theme';
import { useEffect, useRef } from 'react';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';

interface ConfirmationScreenProps {
  sessionId: string;
  onFinish: () => void;
}

export function ConfirmationScreen({ sessionId, onFinish }: ConfirmationScreenProps) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { addTicket } = useTicketStore();
  const { selectedSession, selectedSeats } = useSessionStore();

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    // Salvar o ticket
    if (selectedSession && selectedSeats.length > 0) {
      // Formatar a data para DD/MM/YYYY
      const formattedDate = format(new Date(selectedSession.date), 'dd/MM/yyyy');
      
      addTicket({
        movieTitle: selectedSession.movieTitle,
        date: formattedDate,
        time: selectedSession.time,
        room: selectedSession.room,
        seats: selectedSeats,
        price: selectedSeats.length * selectedSession.price,
      });
    }
  }, []);

  const handleSeeTickets = () => {
    router.push('/(tabs)/tickets');
    onFinish?.();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={[styles.animation, { transform: [{ scale: scaleAnim }] }]}>
        <MaterialIcons 
          name="check-circle" 
          size={rem(8)} 
          color={theme.colors.success} 
        />
      </Animated.View>
      
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Compra realizada com sucesso!
      </Text>
      
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Você receberá os ingressos no seu e-mail em instantes.
      </Text>

      <Button 
        variant="primary"
        size="large"
        onPress={handleSeeTickets}
        title="Ver meus ingressos"
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: rem(1.5),
  },
  animation: {
    width: rem(12),
    height: rem(12),
    marginBottom: rem(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: rem(1.5),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: rem(1),
  },
  subtitle: {
    fontSize: rem(1),
    textAlign: 'center',
    marginBottom: rem(3),
  },
  button: {
    width: '100%',
    maxWidth: rem(20),
  },
}); 