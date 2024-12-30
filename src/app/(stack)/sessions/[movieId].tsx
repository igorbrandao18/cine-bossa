import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, Button } from 'react-native-paper';
import { useSessionStore } from '../../../features/sessions/stores/sessionStore';
import { useMovieStore } from '../../../features/movies/stores/movieStore';

export default function SessionsScreen() {
  const { movieId } = useLocalSearchParams();
  const router = useRouter();
  const { sessions, loading, error, loadSessions } = useSessionStore();
  
  const movie = useMovieStore(state => {
    const sections = state.sections;
    for (const section of Object.values(sections)) {
      const found = section.movies.find(m => m.id === Number(movieId));
      if (found) return found;
    }
    return null;
  });

  useEffect(() => {
    if (movieId) {
      loadSessions(Number(movieId));
    }
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando sessões...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button onPress={() => loadSessions(Number(movieId))}>
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
        <Text style={styles.title}>{movie.title}</Text>
      </View>

      <View style={styles.sessions}>
        {sessions.map(session => (
          <Button
            key={session.id}
            mode="contained"
            style={styles.sessionButton}
            onPress={() => router.push(`/seats/${session.id}`)}
          >
            {session.time} - {session.room}
          </Button>
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
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  sessions: {
    padding: 16,
    gap: 12,
  },
  sessionButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 16,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
}); 