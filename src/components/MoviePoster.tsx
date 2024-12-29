import React, { memo } from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Link } from 'expo-router';
import Animated, { 
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring 
} from 'react-native-reanimated';
import { Movie } from '../types/tmdb';
import { IMAGE_BASE_URL, POSTER_SIZES } from '../config/api';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.28;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

interface MoviePosterProps {
  movie: Movie;
  size?: 'small' | 'large';
}

export const MoviePoster = memo(function MoviePoster({ movie, size = 'small' }: MoviePosterProps) {
  const scale = useSharedValue(1);

  const gesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.95);
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <GestureDetector gesture={gesture}>
        <Animated.View 
          entering={FadeInDown.delay(200)} 
          style={[
            styles.container,
            size === 'large' ? styles.largePoster : styles.smallPoster,
            animatedStyle
          ]}
        >
          <Animated.Image
            source={{ uri: `${IMAGE_BASE_URL}/${POSTER_SIZES.medium}${movie.poster_path}` }}
            style={[
              styles.poster,
              size === 'large' ? styles.largePoster : styles.smallPoster
            ]}
            loading="lazy"
            cachePolicy="memory-disk"
          />
        </Animated.View>
      </GestureDetector>
    </Link>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
    backgroundColor: '#1a1a1a', // Cor de fundo para quando a imagem estiver carregando
  },
  poster: {
    borderRadius: 8,
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