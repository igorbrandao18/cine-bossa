import { useState, useCallback } from 'react';
import { tmdbAPI } from '../services/tmdb';
import { Movie, MoviesResponse, Genre } from '../types/tmdb';

export const useMovies = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);

  const loadGenres = useCallback(async () => {
    try {
      const response = await tmdbAPI.getGenres();
      setGenres(response.data.genres);
    } catch (err) {
      console.error('Erro ao carregar gêneros:', err);
    }
  }, []);

  const getNowPlaying = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await tmdbAPI.getNowPlaying(page);
      return response.data as MoviesResponse;
    } catch (err) {
      setError('Erro ao carregar filmes em cartaz');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPopular = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await tmdbAPI.getPopular(page);
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
      const response = await tmdbAPI.getUpcoming(page);
      return response.data as MoviesResponse;
    } catch (err) {
      console.error('Erro ao carregar próximos lançamentos:', err);
      return null;
    }
  }, []);

  const getTopRated = useCallback(async (page = 1) => {
    try {
      const response = await tmdbAPI.getTopRated(page);
      return response.data as MoviesResponse;
    } catch (err) {
      console.error('Erro ao carregar filmes mais bem avaliados:', err);
      return null;
    }
  }, []);

  const getMoviesByGenre = useCallback(async (genreId: number, page = 1) => {
    try {
      const response = await tmdbAPI.getMoviesByGenre(genreId, page);
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