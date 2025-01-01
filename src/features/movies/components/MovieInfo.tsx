import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import type { Movie } from '../types/movie';

interface MovieInfoProps {
  movie: Movie;
}

export function MovieInfo({ movie }: MovieInfoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` }}
        style={styles.backdrop}
        contentFit="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>
            {new Date(movie.release_date).getFullYear()}
          </Text>
          <Text style={styles.detailText}>{movie.vote_average.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: 300,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  overview: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
  },
  detailText: {
    color: '#fff',
    fontSize: 14,
  },
}); 