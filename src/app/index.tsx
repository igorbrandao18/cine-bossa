import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import { useMovies } from '../hooks/useMovies';
import { Movie } from '../types/tmdb';
import { IMAGE_BASE_URL, POSTER_SIZES } from '../config/api';
import { Link } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { FeaturedMovie } from '../components/FeaturedMovie';
import { MoviePoster } from '../components/MoviePoster';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.28;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;
const BANNER_HEIGHT = width * 0.8;

export default function HomeScreen() {
  const { 
    loading, 
    getNowPlaying, 
    getPopular, 
    getUpcoming, 
    getTopRated,
    genres,
    loadGenres 
  } = useMovies();

  const [featured, setFeatured] = useState<Movie | null>(null);
  const [sections, setSections] = useState<{
    nowPlaying: Movie[];
    popular: Movie[];
    upcoming: Movie[];
    topRated: Movie[];
  }>({
    nowPlaying: [],
    popular: [],
    upcoming: [],
    topRated: [],
  });
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [
        nowPlayingData,
        popularData,
        upcomingData,
        topRatedData
      ] = await Promise.all([
        getNowPlaying(),
        getPopular(),
        getUpcoming(),
        getTopRated()
      ]);

      if (nowPlayingData?.results) {
        setFeatured(nowPlayingData.results[0]);
      }

      setSections({
        nowPlaying: nowPlayingData?.results || [],
        popular: popularData?.results || [],
        upcoming: upcomingData?.results || [],
        topRated: topRatedData?.results || [],
      });

      await loadGenres();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleNextFeatured = useCallback(() => {
    if (sections.nowPlaying.length > 0) {
      setFeaturedIndex((current) => 
        current + 1 >= sections.nowPlaying.length ? 0 : current + 1
      );
    }
  }, [sections.nowPlaying]);

  const MoviePoster = ({ movie, size = 'small' }: { movie: Movie; size?: 'small' | 'large' }) => (
    <Link href={`/movie/${movie.id}`} asChild>
      <Animated.View 
        entering={FadeInDown} 
        style={[
          styles.posterContainer,
          size === 'large' ? styles.largePoster : styles.smallPoster
        ]}
      >
        <Animated.Image
          source={{ uri: `${IMAGE_BASE_URL}/${POSTER_SIZES.medium}${movie.poster_path}` }}
          style={[
            styles.poster,
            size === 'large' ? styles.largePoster : styles.smallPoster
          ]}
        />
      </Animated.View>
    </Link>
  );

  const MovieRow = ({ title, movies }: { title: string; movies: Movie[] }) => (
    <View style={styles.row}>
      <Text variant="titleMedium" style={styles.rowTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {movies.map(movie => (
          <MoviePoster key={movie.id} movie={movie} />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.nowPlaying.length > 0 && (
          <FeaturedMovie 
            movie={sections.nowPlaying[featuredIndex]} 
            onNext={handleNextFeatured}
          />
        )}

        <View style={styles.content}>
          <MovieRow title="Em Cartaz" movies={sections.nowPlaying} />
          <MovieRow title="Populares" movies={sections.popular} />
          <MovieRow title="Próximos Lançamentos" movies={sections.upcoming} />
          <MovieRow title="Mais Bem Avaliados" movies={sections.topRated} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  content: {
    paddingBottom: 20,
  },
  row: {
    marginBottom: 20,
  },
  rowTitle: {
    color: '#fff',
    marginLeft: 16,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  posterContainer: {
    marginHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  poster: {
    borderRadius: 4,
  },
  smallPoster: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
  },
  largePoster: {
    width: ITEM_WIDTH * 1.5,
    height: ITEM_HEIGHT * 1.5,
  },
}); 