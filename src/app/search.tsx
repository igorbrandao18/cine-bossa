import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '../core/theme/rem';
import { useMovieStore } from '../features/movies/stores/movieStore';

export default function Search() {
  const { query } = useLocalSearchParams<{ query: string }>();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const { searchMovies } = useMovieStore();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const response = await searchMovies(query);
        setResults(response.results);
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#E50914" size="large" />
      </View>
    );
  }

  if (!results.length) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="movie-search" size={64} color="#666" />
        <Text style={styles.emptyText}>
          Nenhum resultado encontrado para "{query}"
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Resultados para "{query}"
      </Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieCard}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w342${item.poster_path}` }}
              style={styles.poster}
              contentFit="cover"
            />
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.movieOverview} numberOfLines={3}>
                {item.overview}
              </Text>
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>
                  {item.vote_average.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: rem(3.75),
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: rem(1.25),
  },
  emptyText: {
    color: '#666',
    fontSize: rem(1),
    textAlign: 'center',
    marginTop: rem(1),
  },
  title: {
    fontSize: rem(1.5),
    fontWeight: 'bold',
    color: '#fff',
    padding: rem(1.25),
  },
  listContent: {
    padding: rem(1.25),
    gap: rem(1),
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: rem(0.75),
    overflow: 'hidden',
    height: rem(12),
  },
  poster: {
    width: rem(8),
    height: '100%',
  },
  movieInfo: {
    flex: 1,
    padding: rem(1),
    justifyContent: 'space-between',
  },
  movieTitle: {
    fontSize: rem(1),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: rem(0.5),
  },
  movieOverview: {
    fontSize: rem(0.875),
    color: '#999',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
  },
  rating: {
    color: '#fff',
    fontSize: rem(0.875),
  },
}); 