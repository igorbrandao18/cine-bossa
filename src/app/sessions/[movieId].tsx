import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, IconButton } from 'react-native-paper';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Dados mockados para exemplo
const MOCK_SESSIONS = [
  {
    id: '1',
    room: 'Sala 1',
    datetime: '2024-03-20T14:30:00',
    price: 32.0,
    availableSeats: 45
  },
  {
    id: '2',
    room: 'Sala 2',
    datetime: '2024-03-20T17:00:00',
    price: 32.0,
    availableSeats: 30
  },
  {
    id: '3',
    room: 'Sala VIP',
    datetime: '2024-03-20T19:30:00',
    price: 48.0,
    availableSeats: 20
  }
];

export default function SessionsScreen() {
  const { movieId } = useLocalSearchParams();
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);
  };

  const handleContinue = () => {
    if (selectedSession) {
      router.push(`/seats/${selectedSession}`);
    }
  };

  const formatDateTime = (datetime: string) => {
    return format(new Date(datetime), "dd 'de' MMMM', às' HH:mm", { locale: ptBR });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <IconButton 
          icon="arrow-left" 
          iconColor="#fff" 
          size={24} 
          onPress={() => router.back()} 
        />
        <Title style={styles.headerTitle}>Escolher Sessão</Title>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.sessionList}>
          {MOCK_SESSIONS.map(session => (
            <Card
              key={session.id}
              style={[
                styles.sessionCard,
                selectedSession === session.id && styles.selectedCard
              ]}
              onPress={() => handleSessionSelect(session.id)}
            >
              <Card.Content>
                <Title>{session.room}</Title>
                <Paragraph>{formatDateTime(session.datetime)}</Paragraph>
                <View style={styles.sessionInfo}>
                  <Chip icon="cash" style={styles.chip}>
                    R$ {session.price.toFixed(2)}
                  </Chip>
                  <Chip icon="seat" style={styles.chip}>
                    {session.availableSeats} lugares
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={!selectedSession}
          style={styles.button}
        >
          Escolher Assentos
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    color: '#fff',
    marginLeft: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  sessionList: {
    padding: 16,
  },
  sessionCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 8,
  },
  selectedCard: {
    borderColor: '#E50914',
    borderWidth: 2,
  },
  sessionInfo: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    backgroundColor: '#E5091422',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#E50914',
  },
}); 