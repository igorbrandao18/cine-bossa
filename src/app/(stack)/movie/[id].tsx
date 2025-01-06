import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, StatusBar, Platform } from 'react-native';
import { Button, Title, Paragraph, Chip, Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMovieDetails } from '@/features/movies/hooks/useMovieDetails';
import { MovieDetails } from '@/core/types/tmdb';
import { API_CONFIG, SIZES } from '@/core/config/api';
import { rem } from '@/core/theme/rem';
import { Header } from '@/components/Header';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.7;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 47 : StatusBar.currentHeight || 0;

const MATCH_SCORE = 98; // Simular score de compatibilidade como Netflix

export default function MovieDetailsScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const router = useRouter();
  const { movie, loading, loadMovie } = useMovieDetails(Number(id));

  useEffect(() => {
    if (id) {
      loadMovie();
    }
  }, [id]);

  const handleBuyTicket = () => {
    if (movie) {
      router.push({
        pathname: "/(stack)/sessions/[movieId]",
        params: { 
          movieId: id,
          movieTitle: movie.title 
        }
      });
    }
  };

  if (!movie) return null;

  return (
    <View style={styles.container}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="light-content"
      />
      <View style={styles.content}>
        <ScrollView 
          style={styles.scrollView} 
          bounces={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerContainer}>
            <Image
              source={{ 
                uri: `${API_CONFIG.imageBaseUrl}/${SIZES.backdrop.original}${movie.backdrop_path}` 
              }}
              style={styles.backdrop}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'transparent', 'rgba(0,0,0,0.8)', '#000']}
              style={styles.gradient}
              locations={[0, 0.2, 0.6, 0.9]}
            />
            <Header title={movie.title} />
            <View style={styles.headerContent}>
              <Title style={styles.title}>{movie.title}</Title>
              
              <View style={styles.highlights}>
                <View style={styles.matchScore}>
                  <MaterialCommunityIcons name="thumb-up" size={16} color="#E50914" />
                  <Text style={styles.matchText}>{MATCH_SCORE}% relevante</Text>
                </View>
                <View style={styles.releaseInfo}>
                  <Text style={styles.releaseYear}>
                    {new Date(movie.release_date).getFullYear()}
                  </Text>
                  <View style={styles.dot} />
                  <View style={styles.runtimeContainer}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#ccc" />
                    <Text style={styles.runtime}>{movie.runtime}min</Text>
                  </View>
                </View>
              </View>

              <View style={styles.ratingContainer}>
                <View style={styles.ratingBox}>
                  <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingValue}>
                    {movie.vote_average.toFixed(1)}
                  </Text>
                  <Text style={styles.ratingTotal}>/10</Text>
                </View>
                <View style={styles.votesContainer}>
                  <Text style={styles.votesCount}>
                    {movie.vote_count.toLocaleString()}
                  </Text>
                  <Text style={styles.votesLabel}>avaliações</Text>
                </View>
              </View>

              <View style={styles.qualityTags}>
                <Chip style={styles.qualityChip} textStyle={styles.qualityChipText}>
                  4K Ultra HD
                </Chip>
                <Chip style={styles.qualityChip} textStyle={styles.qualityChipText}>
                  Dolby Atmos
                </Chip>
                {movie.adult && (
                  <Chip style={styles.qualityChip} textStyle={styles.qualityChipText}>
                    18+
                  </Chip>
                )}
              </View>
            </View>
          </View>

          <View style={styles.movieContent}>
            <View style={styles.genreContainer}>
              {movie.genres.map(genre => (
                <Chip 
                  key={genre.id} 
                  style={styles.genreChip}
                  textStyle={styles.genreText}
                >
                  {genre.name}
                </Chip>
              ))}
            </View>

            <Text variant="titleMedium" style={styles.sectionTitle}>Sinopse</Text>
            <Paragraph style={styles.overview}>{movie.overview}</Paragraph>

            <Button 
              mode="contained" 
              onPress={handleBuyTicket}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="ticket"
            >
              Comprar Ingresso
            </Button>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingBottom: rem(4),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    height: HEADER_HEIGHT,
    position: 'relative',
    marginTop: -STATUSBAR_HEIGHT,
  },
  backdrop: {
    width: width,
    height: HEADER_HEIGHT,
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HEADER_HEIGHT,
  },
  headerContent: {
    position: 'absolute',
    bottom: rem(2),
    left: 0,
    right: 0,
    padding: rem(1),
  },
  title: {
    color: '#fff',
    fontSize: rem(2),
    fontWeight: 'bold',
    marginBottom: rem(1),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  highlights: {
    marginBottom: rem(1),
  },
  matchScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
    marginBottom: rem(0.5),
  },
  matchText: {
    color: '#E50914',
    fontSize: rem(1),
    fontWeight: '600',
  },
  releaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
  },
  releaseYear: {
    color: '#ccc',
    fontSize: rem(0.875),
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#666',
  },
  runtimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
  },
  runtime: {
    color: '#ccc',
    fontSize: rem(0.875),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
    marginBottom: rem(1),
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: rem(0.5),
    paddingVertical: rem(0.25),
    borderRadius: rem(0.25),
  },
  ratingValue: {
    color: '#FFD700',
    fontSize: rem(1),
    fontWeight: 'bold',
  },
  ratingTotal: {
    color: '#999',
    fontSize: rem(0.75),
  },
  votesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
  },
  votesCount: {
    color: '#ccc',
    fontSize: rem(0.875),
  },
  votesLabel: {
    color: '#999',
    fontSize: rem(0.875),
  },
  qualityTags: {
    flexDirection: 'row',
    gap: rem(0.5),
  },
  qualityChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  qualityChipText: {
    color: '#fff',
    fontSize: rem(0.75),
  },
  movieContent: {
    padding: rem(1),
    backgroundColor: '#000',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rem(0.5),
    marginBottom: rem(1.5),
  },
  sectionTitle: {
    color: '#fff',
    marginBottom: rem(0.5),
  },
  overview: {
    color: '#ccc',
    fontSize: rem(1),
    lineHeight: rem(1.5),
    marginBottom: rem(2),
  },
  genreChip: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
  },
  genreText: {
    color: '#E50914',
  },
  button: {
    backgroundColor: '#E50914',
    marginBottom: rem(2),
  },
  buttonContent: {
    height: rem(3),
  },
  buttonLabel: {
    fontSize: rem(1),
    fontWeight: 'bold',
  },
}); 