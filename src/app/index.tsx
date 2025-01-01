import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { HomeHeader } from '@/features/movies/components/HomeHeader';
import { MovieList } from '@/features/movies/components/MovieList';
import { ErrorState } from '@/features/movies/components/ErrorState';
import { LoadingState } from '@/features/movies/components/LoadingState';
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
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRefresh} />;
  }

  if (!sections || !sections.nowPlaying.movies.length) {
    return <LoadingState />;
  }

  return (
    <View style={styles.container}>
      <HomeHeader />
      <MovieList 
        sections={memoizedSections}
        featuredMovie={featuredMovie}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
}); 