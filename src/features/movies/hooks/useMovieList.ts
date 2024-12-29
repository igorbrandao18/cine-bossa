import { useCallback } from 'react';
import { useMovieStore } from '../stores/movieStore';
import type { MovieState } from '../types/movie';

export const useMovieList = () => {
  const { sections, loading, error, loadMovies, loadMoreMovies } = useMovieStore();

  const handleLoadMore = useCallback(
    (section: keyof MovieState['sections']) => {
      return loadMoreMovies(section);
    },
    [loadMoreMovies]
  );

  return {
    sections,
    loading,
    error,
    loadMovies,
    loadMore: handleLoadMore,
  };
}; 