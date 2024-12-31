import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { useRouter } from 'expo-router';
import { Button } from '@/shared/components/Button';
import { useSeatStore } from '@/features/seats/stores/seatStore';
import { rem } from '@/shared/utils/rem';
import { SeatGrid } from './SeatGrid';

interface SeatsScreenProps {
  sessionId: string;
}

export function SeatsScreen({ sessionId }: SeatsScreenProps) {
  const router = useRouter();
  const { selectedSeats } = useSeatStore();
  const session = useSessionStore(state => 
    state.sessions.find(s => s.id === sessionId)
  );

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sessão não encontrada</Text>
      </View>
    );
  }

  const handleConfirmSelection = () => {
    if (selectedSeats.length > 0) {
      router.push('/(stack)/payment');
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            {session.movieTitle}
          </Text>
          <Text style={styles.info}>Sessão: {session.time}</Text>
          <Text style={styles.info}>Sala: {session.room}</Text>
        </View>

        <SeatGrid seats={session.seats || []} />

        <View style={styles.footer}>
          <Button 
            mode="contained"
            onPress={handleConfirmSelection}
            disabled={selectedSeats.length === 0}
            style={styles.button}
          >
            Continuar ({selectedSeats.length} {selectedSeats.length === 1 ? 'assento' : 'assentos'})
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    padding: rem(1.25),
  },
  header: {
    marginBottom: rem(2),
  },
  title: {
    color: '#FFF',
    fontSize: rem(1.5),
    marginBottom: rem(1),
  },
  info: {
    color: '#FFF',
    fontSize: rem(1),
    marginBottom: rem(0.5),
  },
  footer: {
    marginTop: rem(2),
  },
  button: {
    width: '100%',
  },
}); 