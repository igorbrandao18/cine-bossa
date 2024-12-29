import React, { memo, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions, View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { Movie } from '../types/tmdb';
import { IMAGE_BASE_URL, POSTER_SIZES } from '../config/api';
import { Link } from 'expo-router';
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
import { BlurView } from 'expo-blur';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const BANNER_HEIGHT = height * 0.7;

interface FeaturedMovieProps {
  movie: Movie;
  onNext?: () => void;
}

export const FeaturedMovie = memo(function FeaturedMovie({ movie, onNext }: FeaturedMovieProps) {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

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

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View 
          entering={FadeIn.duration(300)}
          style={[styles.featuredContainer, animatedStyle]}
        >
          <Animated.Image
            source={{ 
              uri: `${IMAGE_BASE_URL}/${POSTER_SIZES.original}${movie.backdrop_path}` 
            }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
            style={styles.gradient}
            locations={[0, 0.5, 1]}
          >
            <BlurView intensity={20} style={styles.featuredContent}>
              <Text variant="headlineMedium" style={styles.featuredTitle}>
                {movie.title}
              </Text>
              <Text variant="bodyMedium" style={styles.featuredOverview} numberOfLines={3}>
                {movie.overview}
              </Text>
              <Link href={`/movie/${movie.id}`} asChild>
                <Pressable style={styles.playButton}>
                  <Text style={styles.playButtonText}>Comprar Ingresso</Text>
                </Pressable>
              </Link>
            </BlurView>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  container: {
    height: BANNER_HEIGHT,
    width,
  },
  featuredContainer: {
    height: BANNER_HEIGHT,
    width: '100%',
  },
  featuredImage: {
    width: '100%',
    height: BANNER_HEIGHT,
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BANNER_HEIGHT,
    justifyContent: 'flex-end',
    padding: 20,
  },
  featuredContent: {
    borderRadius: 8,
    padding: 16,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredOverview: {
    color: '#fff',
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: '#E50914',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 