import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMovieStore } from '@/features/movies/stores/movieStore';
import { rem } from '@/core/theme/rem';
import { Header } from '@/shared/components/Header';
import { MovieCard } from '@/features/movies/components/MovieCard';

const { width } = Dimensions.get('window');

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

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categoryId = parseInt(id);
  const { genres, getMoviesByGenre } = useMovieStore();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Encontra o gênero atual
  const category = genres.find(g => g.id === categoryId);

  // Se o gênero não existir, volta para a tela anterior
  useEffect(() => {
    if (!category) {
      router.back();
      return;
    }
  }, [category]);

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

    if (category) {
      loadMovies();
    }
  }, [categoryId, category]);

  // Se não encontrou o gênero, não renderiza nada
  if (!category) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header title={category.name} />
      
      <View style={styles.content}>
        <Text style={styles.description}>
          {genreDescriptions[categoryId] || 'Descubra novos filmes deste gênero'}
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#E50914" size="large" />
          </View>
        ) : (
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
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Nenhum filme encontrado nesta categoria
                </Text>
              </View>
            }
          />
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: rem(10),
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: rem(1),
    textAlign: 'center',
  },
}); 