import { create } from 'zustand';
import { MovieDetails } from '../types/tmdb';
import { tmdbAPI } from '../services/tmdb';

interface SessionStore {
  movieDetails: MovieDetails | null;
  loading: boolean;
  error: string | null;
  loadMovieDetails: (movieId: number) => Promise<void>;
}

export const useSessionStore = create<SessionStore>((set) => ({
  movieDetails: null,
  loading: false,
  error: null,

  loadMovieDetails: async (movieId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await tmdbAPI.getMovieDetails(movieId);
      set({ movieDetails: response.data });
    } catch (error) {
      set({ error: 'Erro ao carregar detalhes do filme' });
      console.error('Erro ao carregar detalhes:', error);
    } finally {
      set({ loading: false });
    }
  },
})); 