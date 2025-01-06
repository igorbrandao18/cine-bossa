import { apiClient } from '../../../core/api/client';
import type { Movie, MovieDetails, MovieResponse } from '../types/movie';

class MovieService {
  async getNowPlaying(page: number = 1): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  }

  async getPopular(page: number = 1): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>('/movie/popular', {
      params: { page },
    });
    return response.data;
  }

  async getUpcoming(page: number = 1): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  }

  async getTopRated(page: number = 1): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    const response = await apiClient.get<MovieDetails>(`/movie/${movieId}`);
    return response.data;
  }

  async searchMovies(query: string, page: number = 1): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>('/search/movie', {
      params: { query, page },
    });
    return response.data;
  }

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
      },
    });
    return response.data;
  }

  async getSimilarMovies(movieId: number, page: number = 1): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>(`/movie/${movieId}/similar`, {
      params: { page },
    });
    return response.data;
  }

  async getRecommendedMovies(movieId: number, page: number = 1): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>(`/movie/${movieId}/recommendations`, {
      params: { page },
    });
    return response.data;
  }

  async getGenres() {
    const response = await apiClient.get('/genre/movie/list', {
      params: {
        language: 'pt-BR'
      }
    });
    return response.data;
  }
}

export const movieService = new MovieService(); 