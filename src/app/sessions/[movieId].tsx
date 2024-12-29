import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Image } from 'react-native';
import { Card, Title, Text, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Movie, MovieDetails } from '../../types/tmdb';
import { IMAGE_BASE_URL, BACKDROP_SIZES } from '../../config/api';
import { useSessionStore } from '../../stores/sessionStore';
import { LinearGradient } from 'expo-linear-gradient';

// Dados mockados para exemplo (depois substituir por API)
const MOCK_SESSIONS = [
  {
    id: '1',
    room: 'Sala VIP',
    type: '3D',
    datetime: '2024-03-20T14:30:00',
    price: 45.0,
    availableSeats: 45
  },
  {
    id: '2',
    room: 'Sala Premium',
    type: 'IMAX',
    datetime: '2024-03-20T17:00:00',
    price: 52.0,
    availableSeats: 32
  },
  {
    id: '3',
    room: 'Sala 3',
    type: '2D',
    datetime: '2024-03-20T19:30:00',
    price: 32.0,
    availableSeats: 60
  }
];

export default function SessionsScreen() {
  const { movieId } = useLocalSearchParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const { movieDetails, loading, loadMovieDetails } = useSessionStore();

  useEffect(() => {
    if (movieId) {
      loadMovieDetails(Number(movieId));
    }
  }, [movieId]);

  const handleSelectSession = useCallback((sessionId: string) => {
    router.push({
      pathname: '/seats/[sessionId]',
      params: { 
        sessionId,
        movieId: movieDetails?.id,
        movieTitle: movieDetails?.title
      }
    });
  }, [movieDetails]);

  if (loading || !movieDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{ 
              uri: `${IMAGE_BASE_URL}/${BACKDROP_SIZES.original}${movieDetails.backdrop_path}` 
            }}
            style={styles.backdrop}
          />
          <LinearGradient
            colors={['transparent', '#000']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.movieInfo}>
            <Title style={styles.title}>{movieDetails.title}</Title>
            <View style={styles.details}>
              <Chip style={styles.chip}>
                {movieDetails.runtime} min
              </Chip>
              {movieDetails.genres.map(genre => (
                <Chip key={genre.id} style={styles.chip}>
                  {genre.name}
                </Chip>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Title style={styles.sectionTitle}>Sessões Disponíveis</Title>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.datesContainer}
          >
            {/* Próximos 7 dias */}
            {Array.from({ length: 7 }).map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() + index);
              const isSelected = selectedDate.toDateString() === date.toDateString();

              return (
                <Chip
                  key={date.toISOString()}
                  selected={isSelected}
                  onPress={() => setSelectedDate(date)}
                  style={[styles.dateChip, isSelected && styles.selectedDateChip]}
                >
                  {format(date, 'EEE, dd/MM', { locale: ptBR })}
                </Chip>
              );
            })}
          </ScrollView>

          <View style={styles.sessionsContainer}>
            {MOCK_SESSIONS.map(session => (
              <Card
                key={session.id}
                style={[
                  styles.sessionCard,
                  selectedSession === session.id && styles.selectedSession
                ]}
                onPress={() => handleSelectSession(session.id)}
              >
                <Card.Content>
                  <View style={styles.sessionHeader}>
                    <Title style={styles.roomName}>{session.room}</Title>
                    <Chip mode="outlined" style={styles.typeChip}>
                      {session.type}
                    </Chip>
                  </View>
                  <View style={styles.sessionDetails}>
                    <Text style={styles.time}>
                      {format(new Date(session.datetime), 'HH:mm')}
                    </Text>
                    <Text style={styles.price}>
                      R$ {session.price.toFixed(2)}
                    </Text>
                    <Text style={styles.seats}>
                      {session.availableSeats} lugares disponíveis
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          style={styles.button}
          disabled={!selectedSession}
          onPress={() => router.push(`/seats/${selectedSession}`)}
        >
          Selecionar Assentos
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    height: 200,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  movieInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    backgroundColor: '#E5091422',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    color: '#fff',
    marginBottom: 16,
  },
  datesContainer: {
    marginBottom: 24,
  },
  dateChip: {
    marginRight: 8,
    backgroundColor: '#333',
  },
  selectedDateChip: {
    backgroundColor: '#E50914',
  },
  sessionsContainer: {
    gap: 16,
  },
  sessionCard: {
    backgroundColor: '#1a1a1a',
    marginBottom: 8,
  },
  selectedSession: {
    borderColor: '#E50914',
    borderWidth: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomName: {
    color: '#fff',
    fontSize: 18,
  },
  typeChip: {
    borderColor: '#E50914',
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    color: '#fff',
    fontSize: 16,
  },
  price: {
    color: '#E50914',
    fontSize: 16,
    fontWeight: 'bold',
  },
  seats: {
    color: '#666',
    fontSize: 14,
  },
  footer: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  button: {
    backgroundColor: '#E50914',
  },
}); 