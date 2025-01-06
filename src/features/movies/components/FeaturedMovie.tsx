import React, { memo, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions, View, Pressable, Image, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import { Movie } from '../types/movie';
import { API_CONFIG, SIZES } from '../../../core/config/api';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeIn, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler';
import { Image as ExpoImage } from 'expo-image';
import { rem } from '../../../core/theme/rem';

const { width, height } = Dimensions.get('window');
const FEATURED_HEIGHT = height * 0.7;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;

const DEFAULT_BACKDROP = 'https://image.tmdb.org/t/p/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.png';

// Usando blurhash ao invés de imagem
const PLACEHOLDER_BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

interface FeaturedMovieProps {
  movie: Movie;
  onNext?: () => void;
}

export const FeaturedMovie = memo(function FeaturedMovie({ 
  movie, 
  onNext,
}: FeaturedMovieProps) {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const router = useRouter();

  const handleTransition = useCallback(() => {
    try {
      opacity.value = withTiming(0, { duration: 200 }, (finished) => {
        if (finished) {
          translateX.value = 0;
          scale.value = 1;
          runOnJS(onNext)();
          opacity.value = withTiming(1, { duration: 200 });
        }
      });
    } catch (error) {
      console.error('Erro na transição:', error);
    }
  }, [onNext]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleTransition();
    }, 5000);

    return () => {
      clearInterval(timer);
      translateX.value = 0;
      scale.value = 1;
      opacity.value = 1;
    };
  }, [handleTransition]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      scale.value = interpolate(
        Math.abs(event.translationX),
        [0, 100],
        [1, 0.95],
        Extrapolate.CLAMP
      );
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > width * 0.3) {
        handleTransition();
      } else {
        translateX.value = withSpring(0);
        scale.value = withSpring(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ],
    opacity: opacity.value
  }));

  const handlePress = useCallback(() => {
    router.push({
      pathname: '/sessions/[movieId]',
      params: { movieId: movie.id }
    });
  }, [movie.id]);

  const imageUrl = movie.backdrop_path 
    ? `${API_CONFIG.imageBaseUrl}/${SIZES.backdrop.original}${movie.backdrop_path}`
    : DEFAULT_BACKDROP;

  // Prefetch da próxima imagem
  useEffect(() => {
    if (movie.backdrop_path) {
      const nextImageUrl = `${API_CONFIG.imageBaseUrl}/${SIZES.backdrop.original}${movie.backdrop_path}`;
      Image.prefetch(nextImageUrl);
    }
  }, [movie.backdrop_path]);

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={[styles.featuredContainer, animatedStyle]}
          >
            <ExpoImage
              source={{ uri: imageUrl }}
              style={styles.featuredImage}
              contentFit="cover"
              transition={300}
              placeholder={PLACEHOLDER_BLURHASH}
              cachePolicy="memory-disk"
            />

            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.95)', '#000']}
              style={styles.gradient}
              locations={[0.4, 0.8, 1]}
            >
              <View style={styles.contentContainer}>
                <Text variant="headlineMedium" style={styles.featuredTitle}>
                  {movie.title}
                </Text>
                <Text variant="bodyMedium" style={styles.featuredOverview} numberOfLines={2}>
                  {movie.overview || 'Sem descrição disponível'}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: FEATURED_HEIGHT,
    position: 'relative',
  },
  gestureContainer: {
    flex: 1,
  },
  featuredContainer: {
    height: FEATURED_HEIGHT,
    width: '100%',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: FEATURED_HEIGHT,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: rem(1.5),
    paddingBottom: rem(2.25),
  },
  featuredTitle: {
    color: '#fff',
    fontSize: rem(2),
    fontWeight: 'bold',
    marginBottom: rem(0.75),
  },
  featuredOverview: {
    color: '#fff',
    fontSize: rem(1),
    lineHeight: rem(1.5),
  },
}); 