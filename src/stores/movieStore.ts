import { create } from 'zustand';
import { Movie, MovieVideo } from '../types/tmdb';
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
  currentVideo: MovieVideo | null;

  // Ações
  loadMovies: () => Promise<void>;
  nextFeatured: () => void;
  loadFeaturedVideo: (movieId: number) => Promise<void>;
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
  currentVideo: null,

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

      // Carrega o vídeo do primeiro filme em destaque
      const firstMovie = nowPlayingData.data.results[0];
      if (firstMovie) {
        get().loadFeaturedVideo(firstMovie.id);
      }
    } catch (error) {
      set({ 
        error: 'Erro ao carregar filmes',
        loading: false 
      });
      console.error('Erro ao carregar filmes:', error);
    }
  },

  loadFeaturedVideo: async (movieId: number) => {
    try {
      const response = await tmdbAPI.getMovieVideos(movieId);
      const videos = response.data.results;
      // Procura primeiro por trailers oficiais em português
      const video = videos.find(v => 
        v.type === "Trailer" && 
        v.site === "YouTube" && 
        v.iso_639_1 === "pt"
      ) || 
      // Se não encontrar, procura por qualquer trailer
      videos.find(v => 
        v.type === "Trailer" && 
        v.site === "YouTube"
      ) ||
      // Se ainda não encontrar, usa o primeiro vídeo disponível
      videos[0];

      set({ currentVideo: video || null });
    } catch (error) {
      console.error('Erro ao carregar vídeo:', error);
      set({ currentVideo: null });
    }
  },

  nextFeatured: () => {
    const { sections, featuredIndex } = get();
    const maxIndex = sections.nowPlaying.length - 1;
    const nextIndex = featuredIndex >= maxIndex ? 0 : featuredIndex + 1;
    
    set({ featuredIndex: nextIndex });
    
    // Carrega o vídeo do próximo filme
    const nextMovie = sections.nowPlaying[nextIndex];
    if (nextMovie) {
      get().loadFeaturedVideo(nextMovie.id);
    }
  },

  setError: (error) => set({ error }),
})); 