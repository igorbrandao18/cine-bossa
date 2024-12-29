import React, { memo, useCallback, useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { MoviePoster } from './MoviePoster';
import type { Movie } from '../types/tmdb';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.28;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
}

export const MovieRow = memo(function MovieRow({ 
  title, 
  movies = [], 
  onLoadMore, 
  hasMore = false 
}: MovieRowProps) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const loadingRef = useRef(false);

  const handleScroll = useCallback(async (event: any) => {
    if (loadingRef.current || !hasMore || !onLoadMore) return;

    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const isEndReached = contentOffset.x + layoutMeasurement.width >= contentSize.width - 20;

    if (isEndReached) {
      loadingRef.current = true;
      setIsLoadingMore(true);
      try {
        await onLoadMore();
      } finally {
        setIsLoadingMore(false);
        loadingRef.current = false;
      }
    }
  }, [hasMore, onLoadMore]);

  return (
    <Animated.View 
      entering={FadeIn.delay(200)}
      style={styles.container}
    >
      <Text variant="titleMedium" style={styles.title}>{title}</Text>
      
      {movies.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ref={scrollViewRef}
          contentContainerStyle={styles.content}
          removeClippedSubviews
        >
          {movies.map(movie => (
            <MoviePoster 
              key={movie.id} 
              movie={movie}
              width={ITEM_WIDTH}
              height={ITEM_HEIGHT}
            />
          ))}
          {isLoadingMore && (
            <View style={[styles.loadingContainer, { height: ITEM_HEIGHT }]}>
              <ActivityIndicator color="#E50914" />
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum filme disponível</Text>
        </View>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    color: '#fff',
    marginLeft: 16,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 10,
    gap: 12,
  },
  loadingContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  }
}); 