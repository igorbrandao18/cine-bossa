import { API_CONFIG } from '@/core/config/api';
import { apiClient } from '@/core/services/api';
import { MovieDetails, MovieCredits, MovieVideos, MovieImages, MovieRecommendations } from '@/core/types/tmdb';
import { MovieResponse } from '../types/movie';

export class MovieService {
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    const response = await apiClient.get<MovieDetails>(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,images,credits,recommendations,reviews,similar',
        language: 'pt-BR',
      },
    });
    return response.data;
  }

  async getMovieCredits(movieId: number): Promise<MovieCredits> {
    const response = await apiClient.get<MovieCredits>(`/movie/${movieId}/credits`);
    return response.data;
  }

  async getMovieVideos(movieId: number): Promise<MovieVideos> {
    const response = await apiClient.get<MovieVideos>(`/movie/${movieId}/videos`);
    return response.data;
  }

  async getMovieImages(movieId: number): Promise<MovieImages> {
    const response = await apiClient.get<MovieImages>(`/movie/${movieId}/images`);
    return response.data;
  }

  async getMovieRecommendations(movieId: number): Promise<MovieRecommendations> {
    const response = await apiClient.get<MovieRecommendations>(`/movie/${movieId}/recommendations`);
    return response.data;
  }

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

  async getTrending(timeWindow: 'day' | 'week' = 'week'): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>(`/trending/movie/${timeWindow}`, {
      params: { language: 'pt-BR' },
    });
    return response.data;
  }

  async getLatest(): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>('/movie/latest');
    return response.data;
  }

  async getActionMovies(page: number = 1): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>('/discover/movie', {
      params: {
        page,
        with_genres: '28', // Action genre ID
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  }

  async getComedyMovies(page: number = 1): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>('/discover/movie', {
      params: {
        page,
        with_genres: '35', // Comedy genre ID
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  }

  async getHorrorMovies(page: number = 1): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>('/discover/movie', {
      params: {
        page,
        with_genres: '27', // Horror genre ID
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  }

  async getRomanceMovies(page: number = 1): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>('/discover/movie', {
      params: {
        page,
        with_genres: '10749', // Romance genre ID
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  }

  async getDocumentaries(page: number = 1): Promise<MovieResponse> {
    const response = await apiClient.get<MovieResponse>('/discover/movie', {
      params: {
        page,
        with_genres: '99', // Documentary genre ID
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  }
}

export const movieService = new MovieService(); 