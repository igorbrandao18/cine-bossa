import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable, Dimensions, ScrollView, StatusBar, Platform } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { rem } from '../core/theme/rem';
import { useMovieStore } from '../features/movies/stores/movieStore';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInRight, FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const STATUS_BAR_HEIGHT = Platform.select({
  ios: 47,
  android: StatusBar.currentHeight,
  default: 0,
});

const CATEGORIES = [
  { 
    id: 28, 
    name: 'Ação', 
    icon: 'sword', 
    color: '#E50914',
    description: 'Filmes cheios de adrenalina e emoção'
  },
  { 
    id: 35, 
    name: 'Comédia', 
    icon: 'emoticon-happy', 
    color: '#E50914',
    description: 'Diversão garantida para todos os momentos'
  },
  { 
    id: 27, 
    name: 'Terror', 
    icon: 'ghost', 
    color: '#E50914',
    description: 'Sustos e tensão do início ao fim'
  },
  { 
    id: 10749, 
    name: 'Romance', 
    icon: 'heart', 
    color: '#E50914',
    description: 'Histórias de amor que emocionam'
  },
  { 
    id: 878, 
    name: 'Ficção', 
    icon: 'rocket', 
    color: '#E50914',
    description: 'Aventuras além da imaginação'
  },
  { 
    id: 18, 
    name: 'Drama', 
    icon: 'drama-masks', 
    color: '#E50914',
    description: 'Histórias profundas e emocionantes'
  },
  { 
    id: 16, 
    name: 'Animação', 
    icon: 'animation', 
    color: '#E50914',
    description: 'Diversão para todas as idades'
  },
  { 
    id: 53, 
    name: 'Suspense', 
    icon: 'magnify-scan', 
    color: '#E50914',
    description: 'Mistérios que prendem sua atenção'
  },
] as const;

const SearchHeader = memo(() => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const { sections } = useMovieStore();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const router = useRouter();
  
  const handleSearch = useCallback((text: string) => {
    setValue(text);
    
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    const allMovies = [
      ...(sections.nowPlaying?.movies || []),
      ...(sections.popular?.movies || []),
      ...(sections.upcoming?.movies || []),
    ];

    const filteredMovies = allMovies.filter(movie => 
      movie.title.toLowerCase().includes(text.toLowerCase())
    );

    const uniqueMovies = filteredMovies.filter((movie, index, self) =>
      index === self.findIndex((m) => m.id === movie.id)
    );

    setSearchResults(uniqueMovies);
  }, [sections]);

  const handleClose = () => {
    setFocused(false);
    setValue('');
    setSearchResults([]);
  };
  
  return (
    <>
      <Animated.View 
        style={[
          styles.searchWrapper,
          (focused || value) && styles.searchWrapperFocused
        ]}
      >
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar filmes..."
            value={value}
            onChangeText={handleSearch}
            onFocus={() => setFocused(true)}
            style={[
              styles.searchBar,
              (focused || value) && styles.searchBarFocused
            ]}
            inputStyle={styles.searchInput}
            iconColor="#E50914"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>

        {(focused || value) && (
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.searchResults}
          >
            {value.trim() && searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                  <Animated.View 
                    entering={FadeInRight.duration(400).delay(index * 50)}
                  >
                    <Pressable 
                      style={({ pressed }) => [
                        styles.movieCard,
                        pressed && { opacity: 0.7 }
                      ]}
                      onPress={() => {
                        router.push(`/movie/${item.id}`);
                        handleClose();
                      }}
                    >
                      <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                        style={styles.movieImage}
                        contentFit="cover"
                        transition={200}
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.95)']}
                        style={styles.movieGradient}
                      >
                        <View style={styles.movieContent}>
                          <Text style={styles.movieTitle} numberOfLines={2}>
                            {item.title}
                          </Text>
                          <View style={styles.movieMeta}>
                            <View style={styles.ratingContainer}>
                              <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                              <Text style={styles.rating}>{item.vote_average.toFixed(1)}</Text>
                            </View>
                            <View style={styles.yearContainer}>
                              <Text style={styles.yearText}>
                                {new Date(item.release_date).getFullYear()}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </LinearGradient>
                    </Pressable>
                  </Animated.View>
                )}
                numColumns={2}
                columnWrapperStyle={styles.gridContainer}
                contentContainerStyle={styles.gridContainer}
                showsVerticalScrollIndicator={false}
              />
            ) : value.trim() ? (
              <Animated.View 
                entering={FadeIn.duration(300)}
                style={styles.emptyResults}
              >
                <MaterialCommunityIcons name="movie-search-outline" size={64} color="#E50914" />
                <Text style={styles.emptyResultsTitle}>
                  Nenhum filme encontrado
                </Text>
                <Text style={styles.emptyResultsText}>
                  Não encontramos resultados para "{value}"
                </Text>
              </Animated.View>
            ) : null}
          </Animated.View>
        )}
      </Animated.View>
      {(focused || value) && (
        <Animated.View 
          entering={FadeIn.duration(200)}
          style={styles.overlay}
        />
      )}
    </>
  );
});

const CategoryButton = memo(({ 
  category, 
  isSelected, 
  onPress,
  index
}: { 
  category: typeof CATEGORIES[number];
  isSelected: boolean;
  onPress: () => void;
  index: number;
}) => (
  <Animated.View
    entering={FadeInDown.duration(800).delay(index * 100)}
  >
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryButton,
        pressed && styles.categoryButtonPressed
      ]}
    >
      <View style={styles.categoryContent}>
        <View style={styles.categoryHeader}>
          <Animated.View
            style={[
              styles.categoryIconContainer,
              isSelected && { transform: [{ scale: 1.1 }] }
            ]}
          >
            <MaterialCommunityIcons
              name={category.icon as any}
              size={24}
              color="#E50914"
              style={styles.categoryIcon}
            />
          </Animated.View>
          <Animated.Text 
            style={[
              styles.categoryButtonText,
              isSelected && { opacity: 1 }
            ]}
          >
            {category.name}
          </Animated.Text>
        </View>
        <Text style={styles.categoryDescription} numberOfLines={2}>
          {category.description}
        </Text>
      </View>
    </Pressable>
  </Animated.View>
));

const MovieCard = memo(({ 
  movie, 
  onPress,
  index = 0
}: { 
  movie: any;
  onPress: () => void;
  index?: number;
}) => {
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

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const router = useRouter();
  const { sections, getMoviesByGenre } = useMovieStore();
  const [categoryMovies, setCategoryMovies] = useState<any[]>([]);
  const [genreBackgrounds, setGenreBackgrounds] = useState<Record<number, string>>({});

  // Organize movies by genre when sections change
  useEffect(() => {
    const allMovies = [
      ...(sections.popular?.movies || []),
      ...(sections.nowPlaying?.movies || []),
      ...(sections.upcoming?.movies || []),
    ];

    const backgrounds: Record<number, string> = {};
    
    CATEGORIES.forEach(category => {
      const moviesInGenre = allMovies.filter(movie => 
        movie.genre_ids.includes(category.id)
      );
      
      if (moviesInGenre.length > 0) {
        // Get a random movie from the genre for background
        const randomIndex = Math.floor(Math.random() * moviesInGenre.length);
        backgrounds[category.id] = moviesInGenre[randomIndex].backdrop_path;
      }
    });

    setGenreBackgrounds(backgrounds);
  }, [sections]);

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
    } catch (error) {
      console.error('Error loading category movies:', error);
    }
  }, [selectedCategory, getMoviesByGenre]);

  const trendingMovies = sections.popular?.movies || [];

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
    >
      <SearchHeader />

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Explore por gêneros</Text>
        <View style={styles.categoriesContainer}>
          {CATEGORIES.map((category, index) => (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onPress={() => handleCategoryPress(category.id)}
              index={index}
            />
          ))}
        </View>
      </View>

      {selectedCategory ? (
        <Animated.View 
          entering={FadeIn.duration(300)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>
            {CATEGORIES.find(c => c.id === selectedCategory)?.name}
          </Text>
          <View style={styles.gridContainer}>
            {categoryMovies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPress={() => router.push(`/movie/${movie.id}`)}
                index={index}
              />
            ))}
          </View>
        </Animated.View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendados para você</Text>
          <View style={styles.gridContainer}>
            {trendingMovies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPress={() => router.push(`/movie/${movie.id}`)}
                index={index}
              />
            ))}
          </View>
        </View>
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
  searchWrapper: {
    backgroundColor: '#000',
    position: 'relative',
    zIndex: 2,
    paddingTop: STATUS_BAR_HEIGHT || 0,
  },
  searchWrapperFocused: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
    padding: rem(1.25),
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: rem(3),
    elevation: 0,
    height: rem(3),
  },
  searchBarFocused: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  searchInput: {
    color: '#fff',
    fontSize: rem(1),
  },
  searchResults: {
    flex: 1,
    backgroundColor: '#000',
  },
  emptyResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: rem(2),
  },
  emptyResultsTitle: {
    color: '#fff',
    fontSize: rem(1.25),
    fontWeight: 'bold',
    marginTop: rem(1),
    marginBottom: rem(0.5),
  },
  emptyResultsText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: rem(1),
    textAlign: 'center',
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
  categoriesSection: {
    marginTop: rem(1),
  },
  categoriesContainer: {
    paddingHorizontal: rem(1.25),
    gap: rem(1),
  },
  categoryButton: {
    width: width - rem(2.5),
    borderRadius: rem(0.75),
    overflow: 'hidden',
    padding: rem(1),
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.3)',
  },
  categoryButtonPressed: {
    opacity: 0.8,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
  },
  categoryHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.75),
  },
  categoryIconContainer: {
    width: rem(2.25),
    height: rem(2.25),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: rem(0.5),
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
  },
  categoryIcon: {
    opacity: 0.9,
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: rem(0.9),
    fontWeight: '600',
    opacity: 0.9,
  },
  categoryDescription: {
    flex: 2,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: rem(0.75),
    lineHeight: rem(1.25),
  },
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: rem(1.25),
    gap: rem(1),
    justifyContent: 'space-between',
  },
  footer: {
    height: rem(5),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 1,
  },
}); 