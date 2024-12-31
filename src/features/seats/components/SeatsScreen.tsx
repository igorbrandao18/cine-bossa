import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { useSessionStore } from '@/features/sessions/stores/sessionStore'
import { useRouter } from 'expo-router'
import { Button } from '@/shared/components/Button'

interface SeatsScreenProps {
  sessionId: string
}

const purchaseTickets = async (seats: string[]) => {
  // Simula uma chamada à API
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
};

export function SeatsScreen({ sessionId }: SeatsScreenProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const router = useRouter();
  const session = useSessionStore(state => {
    console.log('Todas as sessões:', state.sessions)
    const found = state.sessions.find(s => s.id === sessionId)
    console.log('Sessão encontrada:', found)
    return found
  })

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sessão não encontrada</Text>
      </View>
    )
  }

  const handlePurchase = async () => {
    try {
      await purchaseTickets(selectedSeats);
      router.push(`/confirmation/${sessionId}`);
    } catch (error) {
      console.error('Erro ao comprar ingressos:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Assentos</Text>
      <Text style={styles.text}>Sessão: {session.id}</Text>
      <Text style={styles.text}>Filme: {session.movieTitle}</Text>
      <Text style={styles.text}>Horário: {session.time}</Text>
      <Text style={styles.text}>Sala: {session.room}</Text>
      <Button 
        mode="contained"
        onPress={handlePurchase}
        disabled={selectedSeats.length === 0}
      >
        Comprar {selectedSeats.length} ingresso(s)
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
  },
}) 