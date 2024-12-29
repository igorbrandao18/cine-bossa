import { create } from 'zustand';
import { Movie } from '../types/tmdb';
import { tmdbAPI } from '../services/tmdb';

interface MovieStore {
  // Estado
  loading: boolean;
  error: string | null;
  sections: {
    nowPlaying: Movie[];
    popular: Movie[];
    upcoming: Movie[];
    topRated: Movie[];
  };
  featuredIndex: number;

  // Ações
  loadMovies: () => Promise<void>;
  nextFeatured: () => void;
  setError: (error: string | null) => void;
}

export const useMovieStore = create<MovieStore>((set, get) => ({
  loading: true,
  error: null,
  sections: {
    nowPlaying: [],
    popular: [],
    upcoming: [],
    topRated: [],
  },
  featuredIndex: 0,

  loadMovies: async () => {
    try {
      set({ loading: true, error: null });
      
      const [
        nowPlayingData,
        popularData,
        upcomingData,
        topRatedData
      ] = await Promise.all([
        tmdbAPI.getNowPlaying(),
        tmdbAPI.getPopular(),
        tmdbAPI.getUpcoming(),
        tmdbAPI.getTopRated()
      ]);

      set({
        sections: {
          nowPlaying: nowPlayingData.data.results,
          popular: popularData.data.results,
          upcoming: upcomingData.data.results,
          topRated: topRatedData.data.results,
        },
        loading: false
      });
    } catch (error) {
      set({ 
        error: 'Erro ao carregar filmes',
        loading: false 
      });
      console.error('Erro ao carregar filmes:', error);
    }
  },

  nextFeatured: () => {
    const { sections, featuredIndex } = get();
    const maxIndex = sections.nowPlaying.length - 1;
    set({ 
      featuredIndex: featuredIndex >= maxIndex ? 0 : featuredIndex + 1 
    });
  },

  setError: (error) => set({ error }),
})); 