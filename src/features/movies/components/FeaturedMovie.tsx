import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_CONFIG } from '@/core/config/api';
import { rem } from '@/core/theme/rem';
import type { Movie } from '../types/movie';
import { useMovieStore } from '../stores/movieStore';

const { width, height } = Dimensions.get('window');
const FEATURED_HEIGHT = height * 0.7;

interface FeaturedMovieProps {
  movie: Movie;
  onNext?: () => void;
}

export function FeaturedMovie({ movie, onNext }: FeaturedMovieProps) {
  const { loadMovieDetails } = useMovieStore();

  const handleMoviePress = () => {
    loadMovieDetails(movie.id, movie);
    router.push(`/movie/${movie.id}`);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleMoviePress}>
        <Image
          source={{ uri: `${API_CONFIG.imageBaseUrl}/original${movie.backdrop_path}` }}
          style={styles.backdrop}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
          style={styles.gradient}
          locations={[0, 0.6, 0.9]}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
          </View>
          <Text style={styles.overview} numberOfLines={3}>
            {movie.overview}
          </Text>
        </View>
      </Pressable>
      {onNext && (
        <Pressable style={styles.nextButton} onPress={onNext}>
          <MaterialCommunityIcons name="chevron-right" size={32} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: FEATURED_HEIGHT,
    position: 'relative',
  },
  backdrop: {
    width: width,
    height: FEATURED_HEIGHT,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: FEATURED_HEIGHT,
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: rem(1.5),
  },
  title: {
    color: '#fff',
    fontSize: rem(2),
    fontWeight: 'bold',
    marginBottom: rem(0.5),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
    marginBottom: rem(0.5),
  },
  rating: {
    color: '#FFD700',
    fontSize: rem(1),
    fontWeight: '600',
  },
  overview: {
    color: '#ccc',
    fontSize: rem(1),
    lineHeight: rem(1.5),
  },
  nextButton: {
    position: 'absolute',
    right: rem(1),
    top: '50%',
    transform: [{ translateY: -16 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: rem(2),
    padding: rem(0.5),
  },
}); 