import React, { useState, useCallback, memo, useRef } from 'react';
import { View, StyleSheet, FlatList, Pressable, Dimensions, ScrollView } from 'react-native';
import { Text, Searchbar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { rem } from '../core/theme/rem';
import { useMovieStore } from '../features/movies/stores/movieStore';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const CATEGORIES = [
  { id: 28, name: 'Ação', icon: 'sword', color: '#FF6B6B' },
  { id: 35, name: 'Comédia', icon: 'emoticon-happy', color: '#4ECDC4' },
  { id: 27, name: 'Terror', icon: 'ghost', color: '#6C5CE7' },
  { id: 10749, name: 'Romance', icon: 'heart', color: '#FF8ED4' },
  { id: 878, name: 'Ficção Científica', icon: 'rocket', color: '#45B7D1' },
  { id: 18, name: 'Drama', icon: 'drama-masks', color: '#96C93D' },
  { id: 16, name: 'Animação', icon: 'animation', color: '#FDA7DF' },
  { id: 53, name: 'Suspense', icon: 'magnify-scan', color: '#A8E6CF' },
] as const;

const SearchHeader = memo(() => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const router = useRouter();
  
  return (
    <Animated.View 
      style={[
        styles.searchContainer,
        focused && styles.searchContainerFocused
      ]}
      entering={FadeIn.duration(400)}
    >
      <Searchbar
        placeholder="O que você quer assistir?"
        value={value}
        onChangeText={setValue}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={({ nativeEvent }) => {
          if (nativeEvent.text.trim()) {
            router.push({
              pathname: '/search',
              params: { query: nativeEvent.text }
            });
          }
        }}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor="#E50914"
        placeholderTextColor="#666"
      />
    </Animated.View>
  );
});

const CategoryButton = memo(({ 
  category, 
  isSelected, 
  onPress 
}: { 
  category: typeof CATEGORIES[number];
  isSelected: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.categoryButton,
      isSelected && { backgroundColor: `${category.color}20` },
      pressed && styles.categoryButtonPressed
    ]}
  >
    <MaterialCommunityIcons
      name={category.icon as any}
      size={20}
      color={isSelected ? category.color : '#fff'}
      style={styles.categoryIcon}
    />
    <Text style={[
      styles.categoryButtonText,
      isSelected && { color: category.color }
    ]}>
      {category.name}
    </Text>
  </Pressable>
));

const MovieCard = memo(({ 
  movie, 
  onPress,
  size = 'normal'
}: { 
  movie: any;
  onPress: () => void;
  size?: 'normal' | 'large';
}) => (
  <Animated.View entering={FadeInRight.duration(400)}>
    <Pressable
      onPress={onPress}
      style={[
        styles.movieCard,
        size === 'large' && styles.movieCardLarge
      ]}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` }}
        style={styles.movieImage}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.movieGradient}
      >
        <View style={styles.movieContent}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {movie.title}
          </Text>
          <View style={styles.movieInfo}>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
            </View>
            <View style={styles.popularityContainer}>
              <MaterialCommunityIcons name="fire" size={16} color="#E50914" />
              <Text style={styles.popularityText}>
                {Math.round(movie.popularity)}k
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  </Animated.View>
));

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const router = useRouter();
  const { sections, getMoviesByGenre } = useMovieStore();
  const [categoryMovies, setCategoryMovies] = useState<any[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const handleCategoryPress = useCallback(async (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setCategoryMovies([]);
      return;
    }

    setSelectedCategory(categoryId);
    try {
      const response = await getMoviesByGenre(categoryId);
      setCategoryMovies(response.results);
      // Scroll suave para os resultados
      scrollRef.current?.scrollTo({ y: 400, animated: true });
    } catch (error) {
      console.error('Error loading category movies:', error);
    }
  }, [selectedCategory, getMoviesByGenre]);

  const trendingMovies = sections.popular?.movies?.slice(0, 10) || [];

  return (
    <ScrollView 
      ref={scrollRef}
      style={styles.container} 
      showsVerticalScrollIndicator={false}
    >
      <SearchHeader />

      <Text style={styles.sectionTitle}>Categorias</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onPress={() => handleCategoryPress(category.id)}
          />
        ))}
      </ScrollView>

      {selectedCategory ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {CATEGORIES.find(c => c.id === selectedCategory)?.name}
          </Text>
          <FlatList
            data={categoryMovies}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                onPress={() => router.push(`/movie/${item.id}`)}
                size="large"
              />
            )}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.moviesContainer}
          />
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tendências</Text>
            <FlatList
              data={trendingMovies.slice(0, 5)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <MovieCard
                  movie={item}
                  onPress={() => router.push(`/movie/${item.id}`)}
                  size="large"
                />
              )}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.moviesContainer}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Populares</Text>
            <FlatList
              data={trendingMovies.slice(5)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <MovieCard
                  movie={item}
                  onPress={() => router.push(`/movie/${item.id}`)}
                />
              )}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.moviesContainer}
            />
          </View>
        </>
      )}

      <View style={styles.footer} />
    </ScrollView>
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
  searchContainerFocused: {
    backgroundColor: '#1a1a1a',
  },
  searchBar: {
    backgroundColor: '#1a1a1a',
    borderRadius: rem(1),
    elevation: 0,
    height: rem(3.5),
  },
  searchInput: {
    color: '#fff',
    fontSize: rem(1),
  },
  section: {
    marginBottom: rem(2),
  },
  sectionTitle: {
    fontSize: rem(1.5),
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: rem(1.25),
    marginVertical: rem(1),
  },
  categoriesContainer: {
    paddingHorizontal: rem(1),
    gap: rem(0.5),
    flexDirection: 'row',
    paddingBottom: rem(1),
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: rem(0.75),
    paddingHorizontal: rem(1),
    borderRadius: rem(2),
    marginRight: rem(0.5),
  },
  categoryButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  categoryIcon: {
    marginRight: rem(0.5),
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: rem(0.875),
    fontWeight: '600',
  },
  moviesContainer: {
    paddingHorizontal: rem(1),
    gap: rem(1),
  },
  movieCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.5625,
    borderRadius: rem(1),
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  movieCardLarge: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.75,
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
  movieGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
  },
  movieContent: {
    padding: rem(1),
  },
  movieTitle: {
    color: '#fff',
    fontSize: rem(1.125),
    fontWeight: 'bold',
    marginBottom: rem(0.5),
  },
  movieInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
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
  popularityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
  },
  popularityText: {
    color: '#999',
    fontSize: rem(0.875),
  },
  footer: {
    height: rem(5),
  },
}); 