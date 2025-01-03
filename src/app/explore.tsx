import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable, Dimensions, ScrollView, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { rem } from '../core/theme/rem';
import { useMovieStore } from '../features/movies/stores/movieStore';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { MovieCard } from '../features/movies/components/MovieCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const STATUS_BAR_HEIGHT = Platform.select({
  ios: 47,
  android: StatusBar.currentHeight,
  default: 0,
});

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

interface CategoryButtonProps {
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
    description: string;
  };
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

const CategoryButton = memo(({ 
  category, 
  isSelected, 
  onPress,
  index
}: CategoryButtonProps) => (
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

export default function Explore() {
  const router = useRouter();
  const { sections, genres, loadGenres, getMoviesByGenre } = useMovieStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadGenres();
      } catch (error) {
        console.error('Error loading genres:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const genreIcons: Record<number, string> = {
    28: 'sword',
    12: 'compass',
    16: 'animation',
    35: 'emoticon-happy',
    80: 'handcuffs',
    99: 'movie-open',
    18: 'drama-masks',
    10751: 'account-group',
    14: 'auto-fix',
    36: 'book-open-page-variant',
    27: 'ghost',
    10402: 'music',
    9648: 'magnify-scan',
    10749: 'heart',
    878: 'rocket',
    10770: 'television-classic',
    53: 'eye-scan',
    10752: 'tank',
    37: 'horse',
  };

  const genreDescriptions: Record<number, string> = {
    28: 'Filmes cheios de adrenalina e emoção',
    12: 'Aventuras épicas e descobertas incríveis',
    16: 'Diversão para todas as idades',
    35: 'Diversão garantida para todos os momentos',
    80: 'Mistérios e crimes intrigantes',
    99: 'Histórias reais que inspiram',
    18: 'Histórias profundas e emocionantes',
    10751: 'Diversão para toda a família',
    14: 'Mundos mágicos e fantásticos',
    36: 'Momentos que marcaram a história',
    27: 'Sustos e tensão do início ao fim',
    10402: 'Ritmo e emoção em cada cena',
    9648: 'Mistérios que prendem sua atenção',
    10749: 'Histórias de amor que emocionam',
    878: 'Aventuras além da imaginação',
    10770: 'Produções especiais para TV',
    53: 'Suspense que prende do início ao fim',
    10752: 'Batalhas e conflitos históricos',
    37: 'Aventuras no velho oeste',
  };

  const trendingMovies = sections.popular?.movies || [];

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator color="#E50914" size="large" />
      </View>
    );
  }

  if (!genres.length) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons name="movie-off" size={64} color="#666" />
        <Text style={styles.errorText}>Não foi possível carregar os gêneros</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
    >
      <SearchHeader />

      {trendingMovies.length > 0 && (
        <View style={styles.recommendedSection}>
          <Text style={styles.sectionTitle}>Recomendados para você</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedContainer}
          >
            {trendingMovies.map((movie, index) => (
              <Animated.View
                key={movie.id}
                entering={FadeInRight.duration(600).delay(index * 100)}
                style={styles.recommendedCard}
              >
                <Pressable
                  onPress={() => router.push(`/movie/${movie.id}`)}
                  style={({ pressed }) => [
                    styles.recommendedPressable,
                    pressed && { opacity: 0.8 }
                  ]}
                >
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                    style={styles.recommendedImage}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.recommendedGradient}
                  >
                    <Text style={styles.recommendedTitle} numberOfLines={2}>
                      {movie.title}
                    </Text>
                    <View style={styles.recommendedMeta}>
                      <View style={styles.ratingContainer}>
                        <MaterialCommunityIcons name="star" size={16} color="#E50914" />
                        <Text style={styles.rating}>
                          {movie.vote_average.toFixed(1)}
                        </Text>
                      </View>
                      <View style={styles.yearContainer}>
                        <Text style={styles.yearText}>
                          {new Date(movie.release_date).getFullYear()}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Explore por gêneros</Text>
        <View style={styles.categoriesContainer}>
          {genres.map((genre, index) => (
            <CategoryButton
              key={genre.id}
              category={{
                id: genre.id,
                name: genre.name,
                icon: genreIcons[genre.id] || 'movie',
                color: '#E50914',
                description: genreDescriptions[genre.id] || 'Descubra novos filmes'
              }}
              isSelected={false}
              onPress={() => router.push({
                pathname: '/category/[id]',
                params: { id: genre.id }
              })}
              index={index}
            />
          ))}
        </View>
      </View>

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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: rem(1),
  },
  errorText: {
    color: '#666',
    fontSize: rem(1),
    textAlign: 'center',
  },
  recommendedSection: {
    marginTop: rem(1),
    marginBottom: rem(2),
  },
  recommendedContainer: {
    paddingHorizontal: rem(1.25),
    paddingTop: rem(1),
    gap: rem(1),
  },
  recommendedCard: {
    width: CARD_WIDTH,
    aspectRatio: 0.7,
    borderRadius: rem(1),
    overflow: 'hidden',
    marginRight: rem(1),
  },
  recommendedPressable: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  recommendedImage: {
    width: '100%',
    height: '100%',
  },
  recommendedGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: rem(1),
    height: '40%',
    justifyContent: 'flex-end',
  },
  recommendedTitle: {
    color: '#fff',
    fontSize: rem(1.1),
    fontWeight: 'bold',
    marginBottom: rem(0.5),
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  recommendedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
  },
}); 