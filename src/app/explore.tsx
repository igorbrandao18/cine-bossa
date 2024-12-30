import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Text, Searchbar, Chip, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { API_CONFIG, SIZES } from '../core/config/api';
import { useHistoryStore } from '../features/movies/stores/historyStore';
import { useFavoriteStore } from '../features/movies/stores/favoriteStore';
import { useMovieStore } from '../features/movies/stores/movieStore';
import type { Movie } from '../features/movies/types/movie';

const { width } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.28;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

const CATEGORIES = [
  { id: 28, name: 'Ação', icon: 'sword' },
  { id: 35, name: 'Comédia', icon: 'emoticon-happy' },
  { id: 27, name: 'Terror', icon: 'ghost' },
  { id: 10749, name: 'Romance', icon: 'heart' },
  { id: 878, name: 'Ficção Científica', icon: 'rocket' },
  { id: 18, name: 'Drama', icon: 'drama-masks' },
  { id: 16, name: 'Animação', icon: 'animation' },
  { id: 53, name: 'Suspense', icon: 'magnify-scan' },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const router = useRouter();
  const { searchHistory, addToSearchHistory, loadSearchHistory } = useHistoryStore();
  const { favorites, loadFavorites } = useFavoriteStore();
  const { getMoviesByGenre } = useMovieStore();
  const [categoryMovies, setCategoryMovies] = useState<Movie[]>([]);

  useEffect(() => {
    loadSearchHistory();
    loadFavorites();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryMovies();
    }
  }, [selectedCategory]);

  const loadCategoryMovies = async () => {
    if (!selectedCategory) return;
    const response = await getMoviesByGenre(selectedCategory);
    if (response) {
      setCategoryMovies(response.results);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    addToSearchHistory(searchQuery);
    // TODO: Implementar busca
    setSearchQuery('');
  };

  const renderMovieCard = (movie: Movie) => (
    <Pressable
      key={movie.id}
      onPress={() => router.push(`/movie/${movie.id}`)}
      style={({ pressed }) => [
        styles.movieCard,
        pressed && styles.movieCardPressed
      ]}
    >
      <Image
        source={{ uri: `${API_CONFIG.imageBaseUrl}/${SIZES.poster.w342}${movie.poster_path}` }}
        style={styles.poster}
        contentFit="cover"
      />
      <Text style={styles.movieTitle} numberOfLines={2}>
        {movie.title}
      </Text>
      <View style={styles.ratingContainer}>
        <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
        <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
      </View>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar</Text>
        <Searchbar
          placeholder="Buscar filmes..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#666"
          placeholderTextColor="#666"
        />
      </View>

      {searchHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buscas Recentes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.searchHistoryContainer}>
              {searchHistory.map((query, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  onPress={() => setSearchQuery(query)}
                  style={styles.historyChip}
                  textStyle={styles.historyChipText}
                >
                  {query}
                </Chip>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
              style={({ pressed }) => [
                styles.categoryCard,
                selectedCategory === category.id && styles.categoryCardSelected,
                pressed && styles.categoryCardPressed,
              ]}
            >
              <MaterialCommunityIcons
                name={category.icon as any}
                size={32}
                color={selectedCategory === category.id ? '#E50914' : '#fff'}
              />
              <Text
                style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.categoryNameSelected,
                ]}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {selectedCategory && categoryMovies.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {CATEGORIES.find(c => c.id === selectedCategory)?.name}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moviesContainer}
          >
            {categoryMovies.map(renderMovieCard)}
          </ScrollView>
        </View>
      )}
    </ScrollView>
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
  searchBar: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    elevation: 0,
  },
  searchInput: {
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  searchHistoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  historyChip: {
    backgroundColor: 'transparent',
    borderColor: '#333',
  },
  historyChipText: {
    color: '#fff',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: (width - 64) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryCardSelected: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    borderColor: '#E50914',
  },
  categoryCardPressed: {
    opacity: 0.8,
  },
  categoryName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryNameSelected: {
    color: '#E50914',
  },
  moviesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  movieCard: {
    width: POSTER_WIDTH,
  },
  movieCardPressed: {
    opacity: 0.8,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
    marginBottom: 8,
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