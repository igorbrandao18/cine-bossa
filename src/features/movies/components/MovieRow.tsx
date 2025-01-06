import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { rem } from '../../../core/theme/rem';
import type { Movie } from '../types/movie';
import { useMovieStore } from '../stores/movieStore';

interface MovieRowProps {
  type: 'trending' | 'nowPlaying' | 'popular' | 'upcoming' | 'topRated' | 'action' | 'comedy' | 'horror' | 'romance' | 'documentary';
  loading?: boolean;
  error?: string | null;
  movies: Movie[];
}

export function MovieRow({ type, loading, error, movies }: MovieRowProps) {
  const { loadMovieDetails } = useMovieStore();

  const handleMoviePress = (movie: Movie) => {
    loadMovieDetails(movie.id, movie);
    router.push(`/movie/${movie.id}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#E50914" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar filmes</Text>
        </View>
      </View>
    );
  }

  if (!movies?.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {movies.map((movie) => (
          <Pressable
            key={movie.id}
            style={styles.movieCard}
            onPress={() => handleMoviePress(movie)}
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w300${movie.poster_path}` }}
              style={styles.poster}
              contentFit="cover"
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: rem(1.5),
  },
  scrollContent: {
    paddingHorizontal: rem(1),
    paddingBottom: rem(1),
    gap: rem(0.75),
  },
  movieCard: {
    borderRadius: rem(0.5),
    overflow: 'hidden',
    elevation: 4,
  },
  poster: {
    width: rem(8), // 128px
    height: rem(12), // 192px
  },
  loadingContainer: {
    height: rem(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: rem(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#666',
    fontSize: rem(1),
  },
}); 