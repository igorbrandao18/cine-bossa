import { useState, useCallback } from 'react';
import { MovieDetails } from '@/core/types/tmdb';
import { movieService } from '../services/movieService';

export const useMovieDetails = (movieId: number) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMovie = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await movieService.getMovieDetails(movieId);
      setMovie(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movie details');
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  return {
    movie,
    loading,
    error,
    loadMovie,
  };
}; 