import React, { memo, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions, View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { Movie } from '../types/tmdb';
import { IMAGE_BASE_URL, BACKDROP_SIZES } from '../config/api';
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
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const BANNER_HEIGHT = height * 0.4;

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
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={[styles.featuredContainer, animatedStyle]}
          >
            <Animated.Image
              source={{ 
                uri: `${IMAGE_BASE_URL}/${BACKDROP_SIZES.original}${movie.backdrop_path}` 
              }}
              style={styles.featuredImage}
              resizeMode="cover"
            />

            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.95)', '#000']}
              style={styles.gradient}
              locations={[0, 0.5, 0.8]}
            >
              <View style={styles.contentContainer}>
                <Text variant="headlineMedium" style={styles.featuredTitle}>
                  {movie.title}
                </Text>
                <Text variant="bodyMedium" style={styles.featuredOverview} numberOfLines={2}>
                  {movie.overview}
                </Text>
                <Link href={`/movie/${movie.id}`} asChild>
                  <Pressable style={styles.playButton}>
                    <Text style={styles.playButtonText}>Comprar Ingresso</Text>
                  </Pressable>
                </Link>
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
    height: BANNER_HEIGHT,
    width,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  gestureContainer: {
    flex: 1,
  },
  featuredContainer: {
    height: BANNER_HEIGHT,
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
    height: BANNER_HEIGHT,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  featuredOverview: {
    color: '#fff',
    marginBottom: 12,
    fontSize: 13,
  },
  playButton: {
    backgroundColor: '#E50914',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 