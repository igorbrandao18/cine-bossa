import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { FeaturedMovie } from '../features/movies/components/FeaturedMovie';
import { useMovieStore } from '../features/movies/stores/movieStore';
import { FeaturedMovieSkeleton } from '../features/movies/components/FeaturedMovieSkeleton';
import { Skeleton } from '../shared/components/Skeleton';
import { cache } from '../core/services/cache';
import type { MovieState } from '../features/movies/types/movie';
import { MovieRow } from '../features/movies/components/MovieRow';
import { testConnection } from '../core/api/tmdb';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.28;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

export default function HomeScreen() {
  const { sections, loading, error, loadNowPlaying, loadPopular, loadUpcoming, loadTopRated } = useMovieStore();
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const init = async () => {
      const isConnected = await testConnection();
      if (isConnected) {
        loadNowPlaying();
        loadPopular();
        loadUpcoming();
        loadTopRated();
      }
    };
    init();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadNowPlaying(),
        loadPopular(),
        loadUpcoming(),
        loadTopRated()
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [loadNowPlaying, loadPopular, loadUpcoming, loadTopRated]);

  const nextFeatured = useCallback(() => {
    if (sections?.nowPlaying?.movies?.length > 0) {
      setFeaturedIndex(prev => 
        prev === sections.nowPlaying.movies.length - 1 ? 0 : prev + 1
      );
    }
  }, [sections?.nowPlaying?.movies?.length]);

  const featuredMovie = useMemo(() => {
    if (sections?.nowPlaying?.movies?.length > 0) {
      return (
        <FeaturedMovie 
          movie={sections.nowPlaying.movies[featuredIndex]} 
          onNext={nextFeatured}
        />
      );
    }
    return null;
  }, [sections?.nowPlaying?.movies, featuredIndex, nextFeatured]);

  const memoizedSections = useMemo(() => {
    if (!sections) return {};
    
    return {
      nowPlaying: {
        title: sections.nowPlaying.title,
        data: sections.nowPlaying.movies,
        loading: sections.nowPlaying.loading,
        error: sections.nowPlaying.error
      },
      popular: {
        title: sections.popular.title,
        data: sections.popular.movies,
        loading: sections.popular.loading,
        error: sections.popular.error
      },
      upcoming: {
        title: sections.upcoming.title,
        data: sections.upcoming.movies,
        loading: sections.upcoming.loading,
        error: sections.upcoming.error
      },
      topRated: {
        title: sections.topRated.title,
        data: sections.topRated.movies,
        loading: sections.topRated.loading,
        error: sections.topRated.error
      }
    };
  }, [sections]);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
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
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar translucent backgroundColor="transparent" />
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={handleRefresh}
          textColor="#fff"
          buttonColor="#E50914"
        >
          Tentar Novamente
        </Button>
      </View>
    );
  }

  if (!sections || !sections.nowPlaying.movies.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
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
          />
        ))}
      </ScrollView>
    </View>
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
    paddingTop: 0,
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