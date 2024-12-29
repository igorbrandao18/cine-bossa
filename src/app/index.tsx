import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { FeaturedMovie } from '../components/FeaturedMovie';
import { useMovieStore } from '../stores/movieStore';
import { FeaturedMovieSkeleton } from '../components/FeaturedMovieSkeleton';
import { Skeleton } from '../components/Skeleton';
import { cache } from '../services/cache';
import type { MovieState } from '../stores/movieStore';
import { MovieRow } from '../components/MovieRow';
import { testConnection } from '../services/tmdb';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.28;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

export default function HomeScreen() {
  const { sections, loading, error, loadMovies, loadMoreMovies } = useMovieStore();
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const init = async () => {
      const isConnected = await testConnection();
      if (isConnected) {
        loadMovies();
      }
    };
    init();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadMovies();
    } finally {
      setRefreshing(false);
    }
  }, [loadMovies]);

  const nextFeatured = useCallback(() => {
    if (sections?.nowPlaying?.data?.length > 0) {
      setFeaturedIndex(prev => 
        prev === sections.nowPlaying.data.length - 1 ? 0 : prev + 1
      );
    }
  }, [sections?.nowPlaying?.data?.length]);

  const featuredMovie = useMemo(() => {
    if (sections?.nowPlaying?.data?.length > 0) {
      return (
        <FeaturedMovie 
          movie={sections.nowPlaying.data[featuredIndex]} 
          onNext={nextFeatured}
        />
      );
    }
    return null;
  }, [sections?.nowPlaying?.data, featuredIndex, nextFeatured]);

  const handleLoadMore = useCallback((section: keyof MovieState['sections']) => {
    return loadMoreMovies(section);
  }, [loadMoreMovies]);

  const memoizedSections = useMemo(() => {
    if (!sections) return {};
    
    return {
      nowPlaying: {
        title: "Em Cartaz",
        data: sections.nowPlaying.data,
        hasMore: sections.nowPlaying.page < sections.nowPlaying.totalPages
      },
      popular: {
        title: "Populares",
        data: sections.popular.data,
        hasMore: sections.popular.page < sections.popular.totalPages
      },
      upcoming: {
        title: "Em Breve",
        data: sections.upcoming.data,
        hasMore: sections.upcoming.page < sections.upcoming.totalPages
      },
      topRated: {
        title: "Mais Bem Avaliados",
        data: sections.topRated.data,
        hasMore: sections.topRated.page < sections.topRated.totalPages
      }
    };
  }, [sections]);

  console.log('Sections:', sections);
  console.log('Memoized Sections:', memoizedSections);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <FeaturedMovieSkeleton />
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} style={styles.row}>
              <Skeleton width={120} height={24} />
              <View style={styles.rowContent}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton 
                    key={i}
                    width={ITEM_WIDTH}
                    height={ITEM_HEIGHT}
                    borderRadius={8}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={loadMovies}
          textColor="#fff"
          buttonColor="#E50914"
        >
          Tentar Novamente
        </Button>
      </View>
    );
  }

  if (!sections || !sections.nowPlaying.data.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#E50914"
            colors={['#E50914']}
            progressBackgroundColor="#1a1a1a"
          />
        }
      >
        {featuredMovie}

        {Object.entries(memoizedSections).map(([key, section]) => (
          <MovieRow 
            key={key}
            title={section.title}
            movies={section.data}
            onLoadMore={() => handleLoadMore(key as keyof MovieState['sections'])}
            hasMore={section.hasMore}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingTop: 0,
  },
  content: {
    paddingBottom: 20,
    paddingTop: 24,
  },
  row: {
    marginBottom: 32,
  },
  rowContent: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20
  }
}); 