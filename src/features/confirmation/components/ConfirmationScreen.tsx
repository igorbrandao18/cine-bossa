import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/shared/components/Button';
import { theme, rem } from '@/theme';
import { useEffect, useRef } from 'react';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { useRouter } from 'expo-router';
import { parse, format, isValid } from 'date-fns';
import { API_CONFIG } from '@/core/config/api';
import { useMovieStore } from '@/features/movies/stores/movieStore';
import { APP_ROUTES } from '@/core/navigation/routes';

interface ConfirmationScreenProps {
  sessionId: string;
  onFinish: () => void;
}

export function ConfirmationScreen({ sessionId, onFinish }: ConfirmationScreenProps) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { addTicket } = useTicketStore();
  const { selectedSession, selectedSeats } = useSessionStore();
  const { sections } = useMovieStore();

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    // Salvar o ticket
    if (selectedSession && selectedSeats.length > 0) {
      // Encontrar o filme nas seções
      const movie = Object.values(sections)
        .flatMap(section => section.movies)
        .find(m => m.id === Number(selectedSession.movieId));

      if (movie) {
        // Usar a data diretamente do selectedSession
        const formattedDate = selectedSession.date;

        addTicket({
          movieId: selectedSession.movieId,
          movieTitle: selectedSession.movieTitle,
          posterPath: movie.poster_path,
          technology: selectedSession.technology,
          date: formattedDate,
          time: selectedSession.time,
          room: selectedSession.room,
          seats: selectedSeats,
          price: selectedSeats.length * selectedSession.price,
          paymentMethod: {
            type: 'CREDIT',
            lastDigits: '1234' // This should come from the payment flow
          }
        });
      }
    }
  }, []);

  const handleSeeTickets = () => {
    router.push('/@tickets');
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