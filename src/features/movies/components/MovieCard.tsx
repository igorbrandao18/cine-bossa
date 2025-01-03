import React, { memo } from 'react';
import { Pressable, StyleSheet, View, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { rem } from '../../../core/theme/rem';

const { width } = Dimensions.get('window');

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
  };
  onPress: () => void;
  index?: number;
}

export const MovieCard = memo(({ 
  movie, 
  onPress,
  index = 0
}: MovieCardProps) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  
  const rStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(scale.value, { 
        damping: 15,
        stiffness: 150
      })},
      { translateY: withSpring(translateY.value, {
        damping: 15,
        stiffness: 150
      })}
    ]
  }));

  const onPressIn = () => {
    scale.value = 0.95;
    translateY.value = -5;
  };

  const onPressOut = () => {
    scale.value = 1;
    translateY.value = 0;
  };

  return (
    <Animated.View 
      entering={FadeInRight.duration(600)
        .delay(index * 100)
        .springify()
      }
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Animated.View style={[styles.movieCard, rStyle]}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
            style={styles.movieImage}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
            style={styles.movieGradient}
          >
            <Animated.View 
              style={styles.movieContent}
              entering={FadeIn.duration(300).delay(100)}
            >
              <Text style={styles.movieTitle} numberOfLines={2}>
                {movie.title}
              </Text>
              <View style={styles.movieMeta}>
                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons 
                    name="star" 
                    size={16} 
                    color="#FFD700"
                    style={{ 
                      textShadowColor: 'rgba(255,215,0,0.5)',
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 10
                    }}
                  />
                  <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
                </View>
                <View style={styles.yearContainer}>
                  <Text style={styles.yearText}>
                    {new Date(movie.release_date).getFullYear()}
                  </Text>
                </View>
              </View>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  movieCard: {
    width: width / 2 - rem(1.5),
    aspectRatio: 0.7,
    borderRadius: rem(0.75),
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    marginBottom: rem(1),
    transform: [
      { perspective: 1000 }
    ],
  },
  movieImage: {
    width: '100%',
    height: '100%',
    transform: [
      { scale: 1.1 }
    ],
  },
  movieGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: rem(0.75),
    backgroundColor: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)',
  },
  movieContent: {
    gap: rem(0.5),
    transform: [
      { translateY: 0 }
    ],
  },
  movieTitle: {
    color: '#fff',
    fontSize: rem(0.875),
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
  },
  rating: {
    color: '#fff',
    fontSize: rem(0.75),
  },
  yearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: rem(0.75),
  },
}); 