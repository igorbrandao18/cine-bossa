import React, { memo, useCallback } from 'react';
import { StyleSheet, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { API_CONFIG, SIZES } from '../../../core/config/api';
import type { Movie } from '../types/movie';

interface MoviePosterProps {
  movie: Movie;
  width: number;
  height: number;
}

const PLACEHOLDER_BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export const MoviePoster = memo(function MoviePoster({ 
  movie, 
  width, 
  height 
}: MoviePosterProps) {
  const router = useRouter();

  return (
    <Pressable 
      onPress={() => router.push(`/movie/${movie.id}`)}
      style={[styles.container, { width, height }]}
    >
      <ExpoImage
        source={{ uri: `${API_CONFIG.imageBaseUrl}/${SIZES.poster.w342}${movie.poster_path}` }}
        style={styles.poster}
        contentFit="cover"
        transition={200}
        placeholder={PLACEHOLDER_BLURHASH}
        cachePolicy="memory-disk"
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
    backgroundColor: '#1a1a1a',
  },
  poster: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  }
}); 