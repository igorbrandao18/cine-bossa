import { apiClient } from '../../../core/api/client';
import { Movie, MovieResponse } from '../types/movie';

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

  async getMovieDetails(movieId: number): Promise<Movie> {
    const response = await apiClient.get<Movie>(`/movie/${movieId}`);
    return response.data;
  }
}

export const movieService = new MovieService(); 