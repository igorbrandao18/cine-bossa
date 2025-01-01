import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { MovieRow } from './MovieRow';
import { FeaturedMovie } from './FeaturedMovie';
import type { MovieSection } from '../types/movie';

interface MovieListProps {
  sections: Record<string, MovieSection>;
  featuredMovie: React.ReactNode;
  refreshing: boolean;
  onRefresh: () => void;
}

export function MovieList({ sections, featuredMovie, refreshing, onRefresh }: MovieListProps) {
  return (
    <ScrollView 
      style={styles.scrollContent}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#E50914"
          colors={['#E50914']}
          progressBackgroundColor="#1a1a1a"
        />
      }
    >
      {featuredMovie}

      {Object.entries(sections).map(([key, section]) => (
        <MovieRow 
          key={key}
          title={section.title}
          movies={section.data}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 0,
  },
  content: {
    paddingBottom: 20,
    paddingTop: 0,
  },
}); 