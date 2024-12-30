import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { API_CONFIG, SIZES } from '../core/config/api';
import { useFavoriteStore } from '../features/movies/stores/favoriteStore';

const { width } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.28;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, loadFavorites, removeFromFavorites } = useFavoriteStore();

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="heart-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>
              Você ainda não tem filmes favoritos
            </Text>
            <Text style={styles.emptySubtext}>
              Adicione filmes aos favoritos para vê-los aqui
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {favorites.map((movie) => (
              <Pressable
                key={movie.id}
                style={styles.movieCard}
                onPress={() => router.push(`/movie/${movie.id}`)}
              >
                <View style={styles.posterContainer}>
                  <Image
                    source={{
                      uri: `${API_CONFIG.imageBaseUrl}/${SIZES.poster.w342}${movie.poster_path}`,
                    }}
                    style={styles.poster}
                    contentFit="cover"
                  />
                  <Pressable
                    style={styles.favoriteButton}
                    onPress={() => removeFromFavorites(movie.id)}
                  >
                    <MaterialCommunityIcons
                      name="heart"
                      size={24}
                      color="#E50914"
                    />
                  </Pressable>
                </View>
                <Text style={styles.movieTitle} numberOfLines={2}>
                  {movie.title}
                </Text>
                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  content: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  movieCard: {
    width: (width - 48) / 3,
  },
  posterContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  poster: {
    width: '100%',
    height: POSTER_HEIGHT,
    borderRadius: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    padding: 4,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: '#ccc',
    fontSize: 12,
  },
}); 