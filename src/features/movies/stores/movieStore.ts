import { create } from 'zustand';
import { movieService } from '../services/movieService';
import { Movie, MovieSection, MovieState } from '../types/movie';
import { MovieDetails, MovieCredits, MovieVideos, MovieImages, MovieRecommendations } from '@/core/types/tmdb';

interface MovieStoreState extends MovieState {
  currentMovie: {
    details: MovieDetails | null;
    credits: MovieCredits | null;
    videos: MovieVideos | null;
    images: MovieImages | null;
    recommendations: MovieRecommendations | null;
  };
}

interface MovieActions {
  loadMovieDetails: (movieId: number) => Promise<void>;
  loadTrending: () => Promise<void>;
  loadNowPlaying: () => Promise<void>;
  loadPopular: () => Promise<void>;
  loadUpcoming: () => Promise<void>;
  loadTopRated: () => Promise<void>;
  loadActionMovies: () => Promise<void>;
  loadComedyMovies: () => Promise<void>;
  loadHorrorMovies: () => Promise<void>;
  loadRomanceMovies: () => Promise<void>;
  loadDocumentaries: () => Promise<void>;
  resetMovieState: () => void;
}

const initialSection: MovieSection = {
  title: '',
  movies: [],
  loading: false,
  error: null,
};

export const useMovieStore = create<MovieStoreState & MovieActions>((set) => ({
  currentMovie: {
    details: null,
    credits: null,
    videos: null,
    images: null,
    recommendations: null,
  },
  sections: {
    trending: { ...initialSection, title: 'Em Alta' },
    nowPlaying: { ...initialSection, title: 'Em Cartaz' },
    popular: { ...initialSection, title: 'Populares' },
    upcoming: { ...initialSection, title: 'Em Breve' },
    topRated: { ...initialSection, title: 'Mais Bem Avaliados' },
    action: { ...initialSection, title: 'Ação' },
    comedy: { ...initialSection, title: 'Comédia' },
    horror: { ...initialSection, title: 'Terror' },
    romance: { ...initialSection, title: 'Romance' },
    documentary: { ...initialSection, title: 'Documentários' },
  },
  genres: [],
  loading: false,
  error: null,

  loadMovieDetails: async (movieId: number) => {
    try {
      set({ loading: true, error: null });

      const [
        details,
        credits,
        videos,
        images,
        recommendations
      ] = await Promise.all([
        movieService.getMovieDetails(movieId),
        movieService.getMovieCredits(movieId),
        movieService.getMovieVideos(movieId),
        movieService.getMovieImages(movieId),
        movieService.getMovieRecommendations(movieId),
      ]);

      set({
        currentMovie: {
          details,
          credits,
          videos,
          images,
          recommendations,
        },
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao carregar detalhes do filme',
        loading: false,
      });
    }
  },

  loadTrending: async () => {
    try {
      set(state => ({
        sections: {
          ...state.sections,
          trending: {
            ...state.sections.trending,
            loading: true,
            error: null,
          },
        },
      }));

      const response = await movieService.getTrending();

      set(state => ({
        sections: {
          ...state.sections,
          trending: {
            ...state.sections.trending,
            movies: response.results,
            loading: false,
          },
        },
      }));
    } catch (error) {
      set(state => ({
        sections: {
          ...state.sections,
          trending: {
            ...state.sections.trending,
            loading: false,
            error: error instanceof Error ? error.message : 'Erro ao carregar filmes em alta',
          },
        },
      }));
    }
  },

  loadNowPlaying: async () => {
    try {
      set(state => ({
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

      set(state => ({
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
      set(state => ({
        sections: {
          ...state.sections,
          nowPlaying: {
            ...state.sections.nowPlaying,
            loading: false,
            error: error instanceof Error ? error.message : 'Erro ao carregar filmes em cartaz',
          },
        },
      }));
    }
  },

  loadPopular: async () => {
    try {
      set(state => ({
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

      set(state => ({
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
      set(state => ({
        sections: {
          ...state.sections,
          popular: {
            ...state.sections.popular,
            loading: false,
            error: error instanceof Error ? error.message : 'Erro ao carregar filmes populares',
          },
        },
      }));
    }
  },

  loadUpcoming: async () => {
    try {
      set(state => ({
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

      set(state => ({
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
      set(state => ({
        sections: {
          ...state.sections,
          upcoming: {
            ...state.sections.upcoming,
            loading: false,
            error: error instanceof Error ? error.message : 'Erro ao carregar próximos lançamentos',
          },
        },
      }));
    }
  },

  loadTopRated: async () => {
    try {
      set(state => ({
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

      set(state => ({
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
      set(state => ({
        sections: {
          ...state.sections,
          topRated: {
            ...state.sections.topRated,
            loading: false,
            error: error instanceof Error ? error.message : 'Erro ao carregar filmes mais bem avaliados',
          },
        },
      }));
    }
  },

  loadActionMovies: async () => {
    try {
      set(state => ({
        sections: {
          ...state.sections,
          action: {
            ...state.sections.action,
            loading: true,
            error: null,
          },
        },
      }));

      const response = await movieService.getActionMovies();

      set(state => ({
        sections: {
          ...state.sections,
          action: {
            ...state.sections.action,
            movies: response.results,
            loading: false,
          },
        },
      }));
    } catch (error) {
      set(state => ({
        sections: {
          ...state.sections,
          action: {
            ...state.sections.action,
            loading: false,
            error: error instanceof Error ? error.message : 'Erro ao carregar filmes de ação',
          },
        },
      }));
    }
  },

  loadComedyMovies: async () => {
    try {
      set(state => ({
        sections: {
          ...state.sections,
          comedy: {
            ...state.sections.comedy,
            loading: true,
            error: null,
          },
        },
      }));

      const response = await movieService.getComedyMovies();

      set(state => ({
        sections: {
          ...state.sections,
          comedy: {
            ...state.sections.comedy,
            movies: response.results,
            loading: false,
          },
        },
      }));
    } catch (error) {
      set(state => ({
        sections: {
          ...state.sections,
          comedy: {
            ...state.sections.comedy,
            loading: false,
            error: error instanceof Error ? error.message : 'Erro ao carregar filmes de comédia',
          },
        },
      }));
    }
  },

  loadHorrorMovies: async () => {
    try {
      set(state => ({
        sections: {
          ...state.sections,
          horror: {
            ...state.sections.horror,
            loading: true,
            error: null,
          },
        },
      }));

      const response = await movieService.getHorrorMovies();

      set(state => ({
        sections: {
          ...state.sections,
          horror: {
            ...state.sections.horror,
            movies: response.results,
            loading: false,
          },
        },
      }));
    } catch (error) {
      set(state => ({
        sections: {
          ...state.sections,
          horror: {
            ...state.sections.horror,
            loading: false,
            error: error instanceof Error ? error.message : 'Erro ao carregar filmes de terror',
          },
        },
      }));
    }
  },

  loadRomanceMovies: async () => {
    try {
      set(state => ({
        sections: {
          ...state.sections,
          romance: {
            ...state.sections.romance,
            loading: true,
            error: null,
          },
        },
      }));

      const response = await movieService.getRomanceMovies();

      set(state => ({
        sections: {
          ...state.sections,
          romance: {
            ...state.sections.romance,
            movies: response.results,
            loading: false,
          },
        },
      }));
    } catch (error) {
      set(state => ({
        sections: {
          ...state.sections,
          romance: {
            ...state.sections.romance,
            loading: false,
            error: error instanceof Error ? error.message : 'Erro ao carregar filmes de romance',
          },
        },
      }));
    }
  },

  loadDocumentaries: async () => {
    try {
      set(state => ({
        sections: {
          ...state.sections,
          documentary: {
            ...state.sections.documentary,
            loading: true,
            error: null,
          },
        },
      }));

      const response = await movieService.getDocumentaries();

      set(state => ({
        sections: {
          ...state.sections,
          documentary: {
            ...state.sections.documentary,
            movies: response.results,
            loading: false,
          },
        },
      }));
    } catch (error) {
      set(state => ({
        sections: {
          ...state.sections,
          documentary: {
            ...state.sections.documentary,
            loading: false,
            error: error instanceof Error ? error.message : 'Erro ao carregar documentários',
          },
        },
      }));
    }
  },

  resetMovieState: () => {
    set({
      currentMovie: {
        details: null,
        credits: null,
        videos: null,
        images: null,
        recommendations: null,
      },
      loading: false,
      error: null,
    });
  },
})); 