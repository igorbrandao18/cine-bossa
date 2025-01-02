import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { FeaturedMovie } from '../features/movies/components/FeaturedMovie';
import { MovieRow } from '../features/movies/components/MovieRow';
import { ScrollView } from 'react-native-gesture-handler';
import { useMovieStore } from '../features/movies/stores/movieStore';
import { LoadingState } from '../features/movies/components/LoadingState';
import { ErrorState } from '../features/movies/components/ErrorState';

export default function Home() {
  const { sections, loadNowPlaying, loadPopular, loadUpcoming } = useMovieStore();
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    loadNowPlaying();
    loadPopular();
    loadUpcoming();
  }, []);

  const handleNextFeatured = () => {
    if (sections?.nowPlaying?.movies?.length > 0) {
      setFeaturedIndex(prev => 
        prev === sections.nowPlaying.movies.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (sections?.nowPlaying?.loading) {
    return <LoadingState />;
  }

  if (sections?.nowPlaying?.error) {
    return <ErrorState error={sections.nowPlaying.error} onRetry={loadNowPlaying} />;
  }

  const featuredMovie = sections?.nowPlaying?.movies?.[featuredIndex];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000' }}>
      {featuredMovie && (
        <FeaturedMovie 
          movie={featuredMovie} 
          onNext={handleNextFeatured}
        />
      )}
      <View style={{ padding: 16 }}>
        <MovieRow title="Em Cartaz" type="nowPlaying" />
        <MovieRow title="Em Breve" type="upcoming" />
        <MovieRow title="Populares" type="popular" />
      </View>
    </ScrollView>
  );
} 