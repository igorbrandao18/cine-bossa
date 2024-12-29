import { apiClient } from './client';
import type { MoviesResponse, MovieDetails } from '../types/tmdb';

// Serviços da API
export const movieService = {
  getNowPlaying: (page = 1) => 
    apiClient.get<MoviesResponse>('/movie/now_playing', { params: { page } }),
  
  getPopular: (page = 1) => 
    apiClient.get<MoviesResponse>('/movie/popular', { params: { page } }),
  
  getUpcoming: (page = 1) => 
    apiClient.get<MoviesResponse>('/movie/upcoming', { params: { page } }),
  
  getTopRated: (page = 1) => 
    apiClient.get<MoviesResponse>('/movie/top_rated', { params: { page } }),
  
  getDetails: (id: number) => 
    apiClient.get<MovieDetails>(`/movie/${id}`),

  getGenres: () => 
    apiClient.get('/genre/movie/list'),

  getMoviesByGenre: (genreId: number, page = 1) =>
    apiClient.get<MoviesResponse>('/discover/movie', { 
      params: { 
        with_genres: genreId,
        page 
      } 
    })
};

export const testConnection = async () => {
  try {
    const response = await apiClient.get('/configuration');
    console.log('✅ API conectada:', response.data);
    return true;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error('❌ Erro de autenticação. Verifique sua API key');
    } else {
      console.error('❌ Erro na conexão:', error.message);
    }
    return false;
  }
};

// Função helper para retry
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}; 