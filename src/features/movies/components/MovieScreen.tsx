import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { useMovieStore } from '@/features/movies/stores/movieStore';
import { theme, rem } from '@/theme';
import { SessionCard } from './SessionCard';

interface MovieScreenProps {
  movieId: string;
}

export function MovieScreen({ movieId }: MovieScreenProps) {
  const router = useRouter();
  const { 
    sections,
    loading: moviesLoading, 
    error: moviesError, 
    loadNowPlaying,
    loadPopular,
    loadUpcoming,
    loadTopRated
  } = useMovieStore();
  
  const { 
    sessions = [], 
    loading: sessionsLoading, 
    error: sessionsError, 
    loadSessions 
  } = useSessionStore();

  // Procurar o filme em todas as seções
  const movie = Object.values(sections)
    .flatMap(section => section.movies)
    .find(m => m.id === movieId);

  useEffect(() => {
    // Carregar todas as seções para garantir que encontraremos o filme
    const loadAllSections = async () => {
      await Promise.all([
        loadNowPlaying(),
        loadPopular(),
        loadUpcoming(),
        loadTopRated()
      ]);
    };
    
    loadAllSections();
  }, []);

  useEffect(() => {
    if (movie) {
      loadSessions(movieId, movie.title);
    }
  }, [movieId, movie]);

  // Verificar se alguma seção está carregando
  const isLoading = moviesLoading || 
    sessionsLoading || 
    Object.values(sections).some(section => section.loading);

  // Verificar se há algum erro em qualquer seção
  const error = moviesError || 
    sessionsError || 
    Object.values(sections).find(section => section.error)?.error;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Filme não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movie.title}</Text>
      {sessions && sessions.length > 0 ? (
        sessions.map(session => (
          <SessionCard 
            key={session.id}
            session={session}
            onPress={() => router.push(`/seats/${session.id}`)}
          />
        ))
      ) : (
        <Text style={styles.text}>Nenhuma sessão disponível</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: rem(1),
  },
  text: {
    color: theme.colors.text,
    textAlign: 'center',
  },
  title: {
    fontSize: rem(1.5),
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: rem(1),
  },
}); 