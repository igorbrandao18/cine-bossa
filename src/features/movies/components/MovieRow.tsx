import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { rem } from '../../../core/theme/rem';
import type { Movie } from '../types/movie';
import { useMovieStore } from '../stores/movieStore';
import { ActivityIndicator } from 'react-native-paper';

interface MovieRowProps {
  title: string;
  type: 'nowPlaying' | 'popular' | 'upcoming' | 'topRated';
}

export function MovieRow({ title, type }: MovieRowProps) {
  const { sections } = useMovieStore();
  const section = sections[type];

  if (section.loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#E50914" />
        </View>
      </View>
    );
  }

  if (section.error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar filmes</Text>
        </View>
      </View>
    );
  }

  if (!section.movies?.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {section.movies.map((movie) => (
          <Pressable
            key={movie.id}
            style={styles.movieCard}
            onPress={() => router.push(`/movie/${movie.id}`)}
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
  title: {
    color: '#fff',
    fontSize: rem(1.25),
    fontWeight: 'bold',
    marginBottom: rem(0.75),
    marginLeft: rem(1),
  },
  scrollContent: {
    paddingHorizontal: rem(1),
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