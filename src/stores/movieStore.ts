import { create } from 'zustand';
import type { Movie } from '../types/tmdb';
import { movieService, withRetry } from '../services/tmdb';
import { cache } from '../services/cache';

interface MovieState {
  sections: {
    nowPlaying: {
      data: Movie[];
      page: number;
      totalPages: number;
    };
    popular: {
      data: Movie[];
      page: number;
      totalPages: number;
    };
    upcoming: {
      data: Movie[];
      page: number;
      totalPages: number;
    };
    topRated: {
      data: Movie[];
      page: number;
      totalPages: number;
    };
  };
  loading: boolean;
  error: string | null;
  prefetchedPages: Record<string, number[]>;
}

interface MovieActions {
  loadMovies: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
  loadMoreMovies: (section: keyof MovieState['sections']) => Promise<void>;
  prefetchNextPage: (section: keyof MovieState['sections']) => Promise<void>;
  refreshMovies: () => Promise<void>;
}

const initialState: MovieState = {
  sections: {
    nowPlaying: {
      data: [],
      page: 1,
      totalPages: 1
    },
    popular: {
      data: [],
      page: 1,
      totalPages: 1
    },
    upcoming: {
      data: [],
      page: 1,
      totalPages: 1
    },
    topRated: {
      data: [],
      page: 1,
      totalPages: 1
    }
  },
  loading: false,
  error: null,
  prefetchedPages: {}
};

const CACHE_KEYS = {
  sections: 'movies:sections',
  movie: (id: number) => `movies:${id}`,
  section: (name: string, page: number) => `movies:${name}:${page}`
};

export const useMovieStore = create<MovieState & MovieActions>((set, get) => ({
  ...initialState,

  loadMovies: async () => {
    set({ loading: true, error: null });
    try {
      const [nowPlaying, popular, upcoming, topRated] = await Promise.all([
        withRetry(() => movieService.getNowPlaying()),
        withRetry(() => movieService.getPopular()),
        withRetry(() => movieService.getUpcoming()),
        withRetry(() => movieService.getTopRated())
      ]);

      const newSections = {
        nowPlaying: {
          data: nowPlaying.data.results,
          page: 1,
          totalPages: nowPlaying.data.total_pages
        },
        popular: {
          data: popular.data.results,
          page: 1,
          totalPages: popular.data.total_pages
        },
        upcoming: {
          data: upcoming.data.results,
          page: 1,
          totalPages: upcoming.data.total_pages
        },
        topRated: {
          data: topRated.data.results,
          page: 1,
          totalPages: topRated.data.total_pages
        }
      };

      await cache.set(CACHE_KEYS.sections, newSections);
      set({ sections: newSections, loading: false });
    } catch (error: any) {
      const message = error.response?.data?.status_message || 
                     error.message || 
                     'Erro ao carregar filmes';
      set({ error: message, loading: false });
    }
  },

  refreshMovies: async () => {
    try {
      const [nowPlaying, popular, upcoming, topRated] = await Promise.all([
        withRetry(() => movieService.getNowPlaying()),
        withRetry(() => movieService.getPopular()),
        withRetry(() => movieService.getUpcoming()),
        withRetry(() => movieService.getTopRated())
      ]);

      const newSections = {
        nowPlaying: {
          data: nowPlaying.data.results,
          page: 1,
          totalPages: nowPlaying.data.total_pages
        },
        popular: {
          data: popular.data.results,
          page: 1,
          totalPages: popular.data.total_pages
        },
        upcoming: {
          data: upcoming.data.results,
          page: 1,
          totalPages: upcoming.data.total_pages
        },
        topRated: {
          data: topRated.data.results,
          page: 1,
          totalPages: topRated.data.total_pages
        }
      };

      await cache.set(CACHE_KEYS.sections, newSections);
      set({ sections: newSections });
    } catch (error) {
      console.error('Erro ao atualizar filmes:', error);
    }
  },

  clearError: () => set({ error: null }),
  
  reset: () => set(initialState),

  prefetchNextPage: async (section: keyof MovieState['sections']) => {
    const currentSection = get().sections[section];
    const prefetchedPages = get().prefetchedPages[section] || [];
    const nextPage = currentSection.page + 1;

    if (
      nextPage <= currentSection.totalPages && 
      !prefetchedPages.includes(nextPage)
    ) {
      try {
        const response = await movieService[section](nextPage);
        await cache.set(`movies:${section}:${nextPage}`, response.data);
        
        set(state => ({
          prefetchedPages: {
            ...state.prefetchedPages,
            [section]: [...(state.prefetchedPages[section] || []), nextPage]
          }
        }));
      } catch (error) {
        console.error(`Erro ao prefetch de ${section}:`, error);
      }
    }
  },

  loadMoreMovies: async (section: keyof MovieState['sections']) => {
    const currentSection = get().sections[section];
    if (currentSection.page >= currentSection.totalPages) return;

    try {
      const nextPage = currentSection.page + 1;
      let data;

      // Tenta pegar do cache primeiro
      const cached = await cache.get(`movies:${section}:${nextPage}`);
      if (cached) {
        data = cached;
      } else {
        const response = await movieService[section](nextPage);
        data = response.data;
      }

      set(state => ({
        sections: {
          ...state.sections,
          [section]: {
            data: [...currentSection.data, ...data.results],
            page: nextPage,
            totalPages: data.total_pages
          }
        }
      }));

      // Prefetch próxima página
      get().prefetchNextPage(section);
    } catch (error) {
      console.error(`Erro ao carregar mais filmes de ${section}:`, error);
    }
  }
})); 