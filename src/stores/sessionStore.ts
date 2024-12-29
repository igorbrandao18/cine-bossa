import { create } from 'zustand';
import type { MovieDetails } from '../types/tmdb';
import { tmdbAPI } from '../services/tmdb';

interface SessionState {
  movieDetails: MovieDetails | null;
  loading: boolean;
  error: string | null;
}

interface SessionActions {
  loadMovieDetails: (movieId: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialState: SessionState = {
  movieDetails: null,
  loading: false,
  error: null
};

export const useSessionStore = create<SessionState & SessionActions>((set) => ({
  ...initialState,

  loadMovieDetails: async (movieId: number) => {
    set({ loading: true, error: null });
    try {
      const { data } = await tmdbAPI.movies.getDetails(movieId);
      set({ movieDetails: data });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar detalhes do filme';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
  
  reset: () => set(initialState)
})); 