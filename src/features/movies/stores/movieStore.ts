import { create } from 'zustand';
import type { MovieState, MovieSection } from '../types/movie';
import { movieService } from '../services/movieService';

interface Genre {
  id: number;
  name: string;
}

interface MovieStoreState extends MovieState {
  genres: Genre[];
  loadGenres: () => Promise<void>;
  loadNowPlaying: () => Promise<void>;
  loadPopular: () => Promise<void>;
  loadUpcoming: () => Promise<void>;
  loadTopRated: () => Promise<void>;
  getMoviesByGenre: (genreId: number) => Promise<any>;
  searchMovies: (query: string) => Promise<any>;
  clearError: () => void;
}

const initialSection: MovieSection = {
  title: '',
  movies: [],
  loading: false,
  error: null,
};

const initialState: MovieState = {
  sections: {
    nowPlaying: { ...initialSection, title: 'Em Cartaz' },
    popular: { ...initialSection, title: 'Populares' },
    upcoming: { ...initialSection, title: 'Em Breve' },
    topRated: { ...initialSection, title: 'Mais Bem Avaliados' },
  },
  genres: [],
  loading: false,
  error: null,
};

export const useMovieStore = create<MovieStoreState>((set, get) => ({
  ...initialState,

  loadGenres: async () => {
    try {
      const response = await movieService.getGenres();
      console.log('Gêneros da API:', response.genres);
      if (!response.genres?.length) {
        throw new Error('No genres returned from API');
      }
      set({ genres: response.genres });
    } catch (error) {
      console.error('Error loading genres:', error);
      set({ genres: [] });
      throw error;
    }
  },

  loadNowPlaying: async () => {
    try {
      set((state) => ({
        sections: {
          ...state.sections,
          nowPlaying: {
            ...state.sections.nowPlaying,
            loading: true,
            error: null,
          },
        },
      }));

      const response = await movieService.getNowPlaying();
      
      set((state) => ({
        sections: {
          ...state.sections,
          nowPlaying: {
            ...state.sections.nowPlaying,
            movies: response.results,
            loading: false,
          },
        },
      }));
    } catch (error) {
      set((state) => ({
        sections: {
          ...state.sections,
          nowPlaying: {
            ...state.sections.nowPlaying,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      }));
    }
  },

  loadPopular: async () => {
    try {
      set((state) => ({
        sections: {
          ...state.sections,
          popular: {
            ...state.sections.popular,
            loading: true,
            error: null,
          },
        },
      }));

      const response = await movieService.getPopular();
      
      set((state) => ({
        sections: {
          ...state.sections,
          popular: {
            ...state.sections.popular,
            movies: response.results,
            loading: false,
          },
        },
      }));
    } catch (error) {
      set((state) => ({
        sections: {
          ...state.sections,
          popular: {
            ...state.sections.popular,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      }));
    }
  },

  loadUpcoming: async () => {
    try {
      set((state) => ({
        sections: {
          ...state.sections,
          upcoming: {
            ...state.sections.upcoming,
            loading: true,
            error: null,
          },
        },
      }));

      const response = await movieService.getUpcoming();

      set((state) => ({
        sections: {
          ...state.sections,
          upcoming: {
            ...state.sections.upcoming,
            movies: response.results,
            loading: false,
          },
        },
      }));
    } catch (error) {
      set((state) => ({
        sections: {
          ...state.sections,
          upcoming: {
            ...state.sections.upcoming,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      }));
    }
  },

  loadTopRated: async () => {
    try {
      set((state) => ({
        sections: {
          ...state.sections,
          topRated: {
            ...state.sections.topRated,
            loading: true,
            error: null,
          },
        },
      }));

      const response = await movieService.getTopRated();

      set((state) => ({
        sections: {
          ...state.sections,
          topRated: {
            ...state.sections.topRated,
            movies: response.results,
            loading: false,
          },
        },
      }));
    } catch (error) {
      set((state) => ({
        sections: {
          ...state.sections,
          topRated: {
            ...state.sections.topRated,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      }));
    }
  },

  getMoviesByGenre: async (genreId: number) => {
    try {
      return await movieService.getMoviesByGenre(genreId);
    } catch (error) {
      console.error('Error getting movies by genre:', error);
      throw error;
    }
  },

  searchMovies: async (query: string) => {
    try {
      return await movieService.searchMovies(query);
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  clearError: () => {
    set((state) => ({
      sections: {
        ...state.sections,
        nowPlaying: { ...state.sections.nowPlaying, error: null },
        popular: { ...state.sections.popular, error: null },
        upcoming: { ...state.sections.upcoming, error: null },
        topRated: { ...state.sections.topRated, error: null },
      },
    }));
  },
})); 