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

// Cache para armazenar resultados por gênero
const genreCache: Record<number, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useMovieStore = create<MovieStoreState>((set, get) => ({
  ...initialState,

  loadGenres: async () => {
    const currentGenres = get().genres;
    if (currentGenres.length > 0) {
      return; // Retorna se já tiver gêneros carregados
    }

    try {
      const response = await movieService.getGenres();
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
    const currentSection = get().sections.nowPlaying;
    if (currentSection.movies.length > 0 && !currentSection.loading) {
      return; // Retorna se já tiver filmes carregados e não estiver carregando
    }

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
    const currentSection = get().sections.popular;
    if (currentSection.movies.length > 0 && !currentSection.loading) {
      return; // Retorna se já tiver filmes carregados e não estiver carregando
    }

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
    const currentSection = get().sections.upcoming;
    if (currentSection.movies.length > 0 && !currentSection.loading) {
      return; // Retorna se já tiver filmes carregados e não estiver carregando
    }

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
    const currentSection = get().sections.topRated;
    if (currentSection.movies.length > 0 && !currentSection.loading) {
      return; // Retorna se já tiver filmes carregados e não estiver carregando
    }

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
    // Verifica se há dados em cache e se ainda são válidos
    const cached = genreCache[genreId];
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await movieService.getMoviesByGenre(genreId);
      // Armazena o resultado no cache
      genreCache[genreId] = {
        data: response,
        timestamp: now
      };
      return response;
    } catch (error) {
      console.error('Error loading movies by genre:', error);
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