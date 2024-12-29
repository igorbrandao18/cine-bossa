import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useMovies } from '../hooks/useMovies';
import { Movie } from '../types/tmdb';
import { MoviePoster } from '../components/MoviePoster';
import { FeaturedMovie } from '../components/FeaturedMovie';

const { width } = Dimensions.get('window');

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
      console.log('Iniciando carregamento dos dados...');
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

      console.log('Dados carregados:', {
        nowPlaying: nowPlayingData?.results?.length,
        popular: popularData?.results?.length,
        upcoming: upcomingData?.results?.length,
        topRated: topRatedData?.results?.length
      });

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

  const MovieRow = ({ title, movies }: { title: string; movies: Movie[] }) => (
    <View style={styles.row}>
      <Text variant="titleMedium" style={styles.rowTitle}>{title}</Text>
      {movies.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {movies.map(movie => (
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
}); 