import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMovieStore } from '../../../features/movies/stores/movieStore';
import { rem } from '../../../core/theme/rem';
import { Header } from '../../../shared/components/Header';
import { MovieCard } from '../../../features/movies/components/MovieCard';

const { width } = Dimensions.get('window');

const CATEGORIES = {
  28: { name: 'Ação', description: 'Filmes cheios de adrenalina e emoção' },
  35: { name: 'Comédia', description: 'Diversão garantida para todos os momentos' },
  27: { name: 'Terror', description: 'Sustos e tensão do início ao fim' },
  10749: { name: 'Romance', description: 'Histórias de amor que emocionam' },
  878: { name: 'Ficção', description: 'Aventuras além da imaginação' },
  18: { name: 'Drama', description: 'Histórias profundas e emocionantes' },
  16: { name: 'Animação', description: 'Diversão para todas as idades' },
  53: { name: 'Suspense', description: 'Mistérios que prendem sua atenção' },
} as const;

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categoryId = parseInt(id);
  const category = CATEGORIES[categoryId as keyof typeof CATEGORIES];
  const { getMoviesByGenre } = useMovieStore();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await getMoviesByGenre(categoryId);
        setMovies(response.results);
      } catch (error) {
        console.error('Error loading category movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [categoryId]);

  return (
    <View style={styles.container}>
      <Header title={category.name} />
      
      <View style={styles.content}>
        <Text style={styles.description}>{category.description}</Text>

        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <MovieCard
              movie={item}
              onPress={() => router.push(`/movie/${item.id}`)}
              index={index}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.gridContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: rem(0.875),
    lineHeight: rem(1.25),
    marginHorizontal: rem(1.25),
    marginVertical: rem(1),
  },
  gridContainer: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingHorizontal: rem(1.25),
    paddingBottom: rem(2),
    gap: rem(1),
  },
}); 