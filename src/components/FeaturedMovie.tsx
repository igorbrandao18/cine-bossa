import React, { useEffect } from 'react';
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
  Extrapolate
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

export function FeaturedMovie({ movie, onNext }: FeaturedMovieProps) {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      scale.value = interpolate(
        Math.abs(event.translationX),
        [0, 100],
        [1, 0.9],
        Extrapolate.CLAMP
      );
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > width * 0.3) {
        translateX.value = withTiming(
          event.translationX > 0 ? width : -width,
          {},
          () => onNext?.()
        );
      } else {
        translateX.value = withSpring(0);
        scale.value = withSpring(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ]
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      onNext?.();
    }, 5000); // Autoplay a cada 5 segundos

    return () => clearInterval(timer);
  }, [onNext]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View 
          entering={FadeIn}
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
}

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