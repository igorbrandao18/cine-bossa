import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Text, Button, Chip } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSessionStore } from '../../stores/sessionStore';
import { useMovieStore } from '../../stores/movieStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { API_CONFIG, SIZES } from '../../config/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function SessionsScreen() {
  const { movieId } = useLocalSearchParams();
  const router = useRouter();
  const { sessions, loading, error, loadSessions } = useSessionStore();
  const movie = useMovieStore(state => 
    state.sections.nowPlaying.data.find(m => m.id === Number(movieId))
  );

  useEffect(() => {
    if (movieId) {
      loadSessions(Number(movieId));
    }
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={() => loadSessions(Number(movieId))}
          buttonColor="#E50914"
          textColor="#fff"
        >
          Tentar Novamente
        </Button>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Filme não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ 
            uri: `${API_CONFIG.imageBaseUrl}/${SIZES.backdrop.large}${movie.backdrop_path}` 
          }}
          style={styles.backdrop}
        />
        <LinearGradient
          colors={['transparent', '#000']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.movieInfo}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.overview} numberOfLines={2}>
            {movie.overview}
          </Text>
          <View style={styles.tags}>
            <Chip 
              mode="outlined" 
              textStyle={styles.chipText}
              style={styles.chip}
            >
              {format(new Date(movie.release_date), 'yyyy')}
            </Chip>
            <Chip 
              mode="outlined" 
              textStyle={styles.chipText}
              style={styles.chip}
            >
              {movie.vote_average.toFixed(1)} ⭐
            </Chip>
          </View>
        </View>
      </View>

      <View style={styles.sessions}>
        <Text style={styles.sectionTitle}>Sessões Disponíveis</Text>
        {sessions.map(session => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionInfo}>
              <Text style={styles.time}>{session.time}</Text>
              <Text style={styles.room}>{session.room}</Text>
            </View>
            <View style={styles.sessionDetails}>
              <Text style={styles.price}>R$ {session.price.toFixed(2)}</Text>
              <Text style={styles.seats}>
                {session.availableSeats} lugares disponíveis
              </Text>
            </View>
            <Button 
              mode="contained"
              onPress={() => router.push(`/seats/${session.id}`)}
              buttonColor="#E50914"
              textColor="#fff"
              style={styles.button}
            >
              Selecionar Assentos
            </Button>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    height: 300,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  overview: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    borderColor: '#E50914',
  },
  chipText: {
    color: '#fff',
  },
  sessions: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sessionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  sessionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  room: {
    fontSize: 16,
    color: '#999',
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    color: '#E50914',
    fontWeight: 'bold',
  },
  seats: {
    fontSize: 14,
    color: '#999',
  },
  button: {
    marginTop: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  }
}); 