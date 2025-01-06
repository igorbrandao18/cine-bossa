import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { FeaturedMovie } from '@/features/movies/components/FeaturedMovie';
import { MovieRow } from '@/features/movies/components/MovieRow';
import { useMovieStore } from '@/features/movies/stores/movieStore';
import { LoadingState } from '@/features/movies/components/LoadingState';
import { ErrorState } from '@/features/movies/components/ErrorState';
import { rem } from '@/core/theme/rem';

const SECTIONS = [
  { type: 'trending', title: 'Em Alta' },
  { type: 'nowPlaying', title: 'Em Cartaz' },
  { type: 'popular', title: 'Populares' },
  { type: 'upcoming', title: 'Em Breve' },
  { type: 'topRated', title: 'Mais Bem Avaliados' },
  { type: 'action', title: 'Ação' },
  { type: 'comedy', title: 'Comédia' },
  { type: 'horror', title: 'Terror' },
  { type: 'romance', title: 'Romance' },
  { type: 'documentary', title: 'Documentários' },
] as const;

export default function Home() {
  const { 
    sections, 
    loadTrending,
    loadNowPlaying, 
    loadPopular, 
    loadUpcoming, 
    loadTopRated,
    loadActionMovies,
    loadComedyMovies,
    loadHorrorMovies,
    loadRomanceMovies,
    loadDocumentaries,
  } = useMovieStore();
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    loadTrending();
    loadNowPlaying();
    loadPopular();
    loadUpcoming();
    loadTopRated();
    loadActionMovies();
    loadComedyMovies();
    loadHorrorMovies();
    loadRomanceMovies();
    loadDocumentaries();

    // Inicia com um índice aleatório
    if (sections?.trending?.movies?.length > 0) {
      setFeaturedIndex(Math.floor(Math.random() * sections.trending.movies.length));
    }
  }, []);

  const handleNextFeatured = () => {
    if (sections?.trending?.movies?.length > 0) {
      // Gera um novo índice aleatório diferente do atual
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * sections.trending.movies.length);
      } while (newIndex === featuredIndex && sections.trending.movies.length > 1);
      
      setFeaturedIndex(newIndex);
    }
  };

  if (sections?.trending?.loading) {
    return <LoadingState />;
  }

  if (sections?.trending?.error) {
    return <ErrorState error={sections.trending.error} onRetry={loadTrending} />;
  }

  const featuredMovie = sections?.trending?.movies?.[featuredIndex];

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {featuredMovie && (
        <FeaturedMovie 
          movie={featuredMovie} 
          onNext={handleNextFeatured}
        />
      )}
      
      <View style={styles.content}>
        {SECTIONS.map(section => (
          <View key={section.type} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {section.title}
            </Text>
            <MovieRow 
              type={section.type} 
              loading={sections[section.type]?.loading}
              error={sections[section.type]?.error}
              movies={sections[section.type]?.movies || []}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    paddingVertical: rem(1),
    paddingBottom: rem(4),
  },
  section: {
    marginBottom: rem(2),
  },
  sectionTitle: {
    fontSize: rem(1.5),
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: rem(1.25),
    marginBottom: rem(1),
  },
}); 