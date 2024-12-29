import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Movie } from '../types/tmdb';
import { IMAGE_BASE_URL, POSTER_SIZES } from '../config/api';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.28;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

interface MoviePosterProps {
  movie: Movie;
  size?: 'small' | 'large';
}

export function MoviePoster({ movie, size = 'small' }: MoviePosterProps) {
  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <Animated.View 
        entering={FadeInDown} 
        style={[
          styles.container,
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
}

const styles = StyleSheet.create({
  container: {
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