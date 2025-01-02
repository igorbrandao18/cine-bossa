import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text, ActivityIndicator, Searchbar } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '../core/theme/rem';
import { useMovieStore } from '../features/movies/stores/movieStore';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

const SearchHeader = ({ initialQuery, onSearch }: { initialQuery: string, onSearch: (text: string) => void }) => {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();

  return (
    <Animated.View 
      style={styles.searchContainer}
      entering={FadeIn.duration(400)}
    >
      <View style={styles.searchRow}>
        <Pressable 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </Pressable>
        <Searchbar
          placeholder="O que você quer assistir?"
          value={value}
          onChangeText={(text) => {
            setValue(text);
            onSearch(text);
          }}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#E50914"
          placeholderTextColor="#666"
          autoFocus
        />
      </View>
    </Animated.View>
  );
};

export default function Search() {
  const { query } = useLocalSearchParams<{ query: string }>();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(query || '');
  const { sections } = useMovieStore();
  const router = useRouter();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
      setLoading(false);
      return;
    }
    
    const allMovies = [
      ...(sections.nowPlaying?.movies || []),
      ...(sections.popular?.movies || []),
      ...(sections.upcoming?.movies || []),
    ];

    const filteredMovies = allMovies.filter(movie => 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const uniqueMovies = filteredMovies.filter((movie, index, self) =>
      index === self.findIndex((m) => m.id === movie.id)
    );

    setResults(uniqueMovies);
    setLoading(false);
  }, [searchQuery, sections]);

  return (
    <View style={styles.container}>
      <SearchHeader initialQuery={query || ''} onSearch={handleSearch} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#E50914" size="large" />
        </View>
      ) : !results.length ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="movie-search" size={64} color="#666" />
          <Text style={styles.emptyText}>
            Nenhum filme em cartaz encontrado para "{searchQuery}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable 
              style={styles.movieCard}
              onPress={() => router.push(`/movie/${item.id}`)}
            >
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
            </Pressable>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchContainer: {
    padding: rem(1.25),
    paddingTop: rem(3),
    backgroundColor: '#000',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
  },
  backButton: {
    padding: rem(0.5),
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: rem(1),
    elevation: 0,
    height: rem(3.5),
  },
  searchInput: {
    color: '#fff',
    fontSize: rem(1),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: rem(2),
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: rem(1),
    fontSize: rem(1),
  },
  listContent: {
    padding: rem(1.25),
    gap: rem(1),
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: rem(1),
    overflow: 'hidden',
    height: rem(9),
  },
  poster: {
    width: rem(6),
    height: '100%',
  },
  movieInfo: {
    flex: 1,
    padding: rem(1),
    justifyContent: 'space-between',
  },
  movieTitle: {
    color: '#fff',
    fontSize: rem(1.125),
    fontWeight: 'bold',
  },
  movieOverview: {
    color: '#999',
    fontSize: rem(0.875),
    lineHeight: rem(1.25),
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