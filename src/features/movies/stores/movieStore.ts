import { create } from 'zustand';
import { MovieState, MovieSection } from '../types/movie';
import { movieService } from '../services/movieService';

const initialSection: MovieSection = {
  data: [],
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

const initialState: MovieState = {
  sections: {
    nowPlaying: { ...initialSection },
    popular: { ...initialSection },
    upcoming: { ...initialSection },
    topRated: { ...initialSection },
  },
  loading: false,
  error: null,
};

export const useMovieStore = create<
  MovieState & {
    loadMovies: () => Promise<void>;
    loadMoreMovies: (section: keyof MovieState['sections']) => Promise<void>;
  }
>((set, get) => ({
  ...initialState,

  loadMovies: async () => {
    set({ loading: true, error: null });
    try {
      const [nowPlaying, popular, upcoming, topRated] = await Promise.all([
        movieService.getNowPlaying(),
        movieService.getPopular(),
        movieService.getUpcoming(),
        movieService.getTopRated(),
      ]);

      set({
        sections: {
          nowPlaying: {
            data: nowPlaying.results,
            page: nowPlaying.page,
            totalPages: nowPlaying.total_pages,
            loading: false,
          },
          popular: {
            data: popular.results,
            page: popular.page,
            totalPages: popular.total_pages,
            loading: false,
          },
          upcoming: {
            data: upcoming.results,
            page: upcoming.page,
            totalPages: upcoming.total_pages,
            loading: false,
          },
          topRated: {
            data: topRated.results,
            page: topRated.page,
            totalPages: topRated.total_pages,
            loading: false,
          },
        },
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load movies',
        loading: false,
      });
    }
  },

  loadMoreMovies: async (section: keyof MovieState['sections']) => {
    const currentSection = get().sections[section];
    if (
      currentSection.loading ||
      currentSection.page >= currentSection.totalPages
    ) {
      return;
    }

    set((state) => ({
      sections: {
        ...state.sections,
        [section]: { ...currentSection, loading: true },
      },
    }));

    try {
      const nextPage = currentSection.page + 1;
      let response;

      switch (section) {
        case 'nowPlaying':
          response = await movieService.getNowPlaying(nextPage);
          break;
        case 'popular':
          response = await movieService.getPopular(nextPage);
          break;
        case 'upcoming':
          response = await movieService.getUpcoming(nextPage);
          break;
        case 'topRated':
          response = await movieService.getTopRated(nextPage);
          break;
      }

      if (response) {
        set((state) => ({
          sections: {
            ...state.sections,
            [section]: {
              data: [...currentSection.data, ...response.results],
              page: response.page,
              totalPages: response.total_pages,
              loading: false,
            },
          },
        }));
      }
    } catch (error) {
      set((state) => ({
        sections: {
          ...state.sections,
          [section]: {
            ...currentSection,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to load more movies',
          },
        },
      }));
    }
  },
})); 