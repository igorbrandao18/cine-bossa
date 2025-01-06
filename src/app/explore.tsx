import React, { useState, useCallback, memo, useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable, Dimensions, ScrollView, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { rem } from '../core/theme/rem';
import { useMovieStore } from '@/features/movies/stores/movieStore';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

const SearchHeader = memo(() => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const { searchMovies } = useMovieStore();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const router = useRouter();
  
  const handleSearch = useCallback(async (text: string) => {
    setValue(text);
    
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchMovies(text);
      setSearchResults(results.results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
      setSearchResults([]);
    }
  }, []);

  return (
    <>
      <Animated.View 
        style={[
          styles.searchWrapper,
          (focused || value) && styles.searchWrapperFocused
        ]}
        entering={FadeIn.duration(300)}
      >
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar filmes..."
            value={value}
            onChangeText={handleSearch}
            onFocus={() => setFocused(true)}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor="#E50914"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>

        {(focused || value) && searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable 
                onPress={() => router.push(`/movie/${item.id}`)}
                style={styles.searchResultItem}
              >
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster_path}` }}
                  style={styles.searchResultImage}
                  contentFit="cover"
                />
                <View style={styles.searchResultContent}>
                  <Text style={styles.searchResultTitle}>{item.title}</Text>
                  <Text style={styles.searchResultYear}>
                    {new Date(item.release_date).getFullYear()}
                  </Text>
                </View>
              </Pressable>
            )}
            style={styles.searchResults}
          />
        )}
      </Animated.View>
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
  onPress: () => void;
  index: number;
}

const CategoryButton = memo(({ category, onPress, index }: CategoryButtonProps) => (
  <Animated.View
    entering={FadeInDown.duration(300).delay(index * 50)}
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
          <MaterialCommunityIcons
            name={category.icon as any}
            size={24}
            color="#E50914"
            style={styles.categoryIcon}
          />
          <Text style={styles.categoryButtonText}>
            {category.name}
          </Text>
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
  const { sections, genres, loadGenres, loadPopular } = useMovieStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          loadGenres(),
          loadPopular()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
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
                entering={FadeInDown.duration(300).delay(index * 50)}
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
              onPress={() => router.push(`/category/${genre.id}`)}
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
    paddingTop: Platform.select({
      ios: 47,
      android: StatusBar.currentHeight,
      default: 0,
    }),
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
  searchInput: {
    color: '#fff',
    fontSize: rem(1),
  },
  searchResults: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
    padding: rem(1),
    borderRadius: rem(0.75),
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    marginBottom: rem(1),
  },
  searchResultImage: {
    width: rem(4),
    height: rem(6),
    borderRadius: rem(0.5),
  },
  searchResultContent: {
    flex: 1,
    padding: rem(0.75),
  },
  searchResultTitle: {
    color: '#fff',
    fontSize: rem(0.875),
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  searchResultYear: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: rem(0.75),
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