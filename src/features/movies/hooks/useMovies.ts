import { useState, useCallback } from 'react';
import { movieService } from '../../../core/api/tmdb';
import { Movie, MoviesResponse } from '../../../core/types/tmdb';

export const useMovies = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<any[]>([]);

  const loadGenres = useCallback(async () => {
    try {
      const response = await movieService.getGenres();
      setGenres(response.data.genres);
    } catch (err) {
      console.error('Erro ao carregar gêneros:', err);
    }
  }, []);

  const getNowPlaying = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await movieService.getNowPlaying(page);
      console.log('getNowPlaying response:', response.data);
      return response.data as MoviesResponse;
    } catch (err) {
      console.error('Erro em getNowPlaying:', err);
      setError('Erro ao carregar filmes em cartaz');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPopular = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await movieService.getPopular(page);
      return response.data as MoviesResponse;
    } catch (err) {
      setError('Erro ao carregar filmes populares');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUpcoming = useCallback(async (page = 1) => {
    try {
      const response = await movieService.getUpcoming(page);
      return response.data as MoviesResponse;
    } catch (err) {
      console.error('Erro ao carregar próximos lançamentos:', err);
      return null;
    }
  }, []);

  const getTopRated = useCallback(async (page = 1) => {
    try {
      const response = await movieService.getTopRated(page);
      return response.data as MoviesResponse;
    } catch (err) {
      console.error('Erro ao carregar filmes mais bem avaliados:', err);
      return null;
    }
  }, []);

  const getMoviesByGenre = useCallback(async (genreId: number, page = 1) => {
    try {
      const response = await movieService.getMoviesByGenre(genreId, page);
      return response.data as MoviesResponse;
    } catch (err) {
      console.error('Erro ao carregar filmes por gênero:', err);
      return null;
    }
  }, []);

  return {
    loading,
    error,
    genres,
    loadGenres,
    getNowPlaying,
    getPopular,
    getUpcoming,
    getTopRated,
    getMoviesByGenre,
  };
}; 