import React, { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { MoviePoster } from '../components/MoviePoster';
import { FeaturedMovie } from '../components/FeaturedMovie';
import { useMovieStore } from '../stores/movieStore';

const { width } = Dimensions.get('window');

// Componente MovieRow memoizado para evitar re-renders desnecessários
const MovieRow = React.memo(({ title, movies }: { title: string; movies: Movie[] }) => {
  const [visibleMovies, setVisibleMovies] = useState<Movie[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setVisibleMovies(movies.slice(0, 5));
  }, [movies]);

  const handleScroll = useCallback((event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const isEndReached = contentOffset.x + layoutMeasurement.width >= contentSize.width - 20;

    if (isEndReached && visibleMovies.length < movies.length) {
      setVisibleMovies(prev => [
        ...prev,
        ...movies.slice(prev.length, prev.length + 5)
      ]);
    }
  }, [movies, visibleMovies]);

  return (
    <View style={styles.row}>
      <Text variant="titleMedium" style={styles.rowTitle}>{title}</Text>
      {movies.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={true}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ref={scrollViewRef}
          contentContainerStyle={styles.rowContent}
          style={styles.scrollView}
        >
          {visibleMovies.map(movie => (
            <MoviePoster key={movie.id} movie={movie} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyRow}>
          <Text style={styles.emptyText}>Nenhum filme disponível</Text>
        </View>
      )}
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.movies.length === nextProps.movies.length;
});

export default function HomeScreen() {
  const { 
    loading, 
    sections, 
    featuredIndex,
    loadMovies,
    nextFeatured 
  } = useMovieStore();

  useEffect(() => {
    loadMovies();
  }, []);

  // Memoize o featured movie para evitar re-renders desnecessários
  const featuredMovie = useMemo(() => {
    if (sections.nowPlaying.length > 0) {
      return (
        <FeaturedMovie 
          movie={sections.nowPlaying[featuredIndex]} 
          onNext={nextFeatured}
        />
      );
    }
    return null;
  }, [sections.nowPlaying, featuredIndex]);

  // Memoize as seções de filmes
  const movieSections = useMemo(() => (
    <View style={styles.content}>
      <MovieRow title="Em Cartaz" movies={sections.nowPlaying} />
      <MovieRow title="Populares" movies={sections.popular} />
      <MovieRow title="Próximos Lançamentos" movies={sections.upcoming} />
      <MovieRow title="Mais Bem Avaliados" movies={sections.topRated} />
    </View>
  ), [sections]);

  if (loading && !sections.nowPlaying.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        removeClippedSubviews={true}
      >
        {featuredMovie}
        {movieSections}
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
    paddingTop: 24,
  },
  row: {
    marginBottom: 24,
  },
  rowTitle: {
    color: '#fff',
    marginLeft: 16,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  emptyRow: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  rowContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  scrollView: {
    marginTop: 8,
  },
}); 