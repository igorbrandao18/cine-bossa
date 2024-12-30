import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Movie } from '../types/movie';

const WATCH_HISTORY_KEY = '@cine-bossa:watch-history';
const SEARCH_HISTORY_KEY = '@cine-bossa:search-history';

interface HistoryState {
  watchHistory: Movie[];
  searchHistory: string[];
  loading: boolean;
  error: string | null;
}

interface HistoryStore extends HistoryState {
  loadWatchHistory: () => Promise<void>;
  loadSearchHistory: () => Promise<void>;
  addToWatchHistory: (movie: Movie) => Promise<void>;
  addToSearchHistory: (query: string) => Promise<void>;
  removeFromWatchHistory: (movieId: number) => Promise<void>;
  removeFromSearchHistory: (query: string) => Promise<void>;
  clearWatchHistory: () => Promise<void>;
  clearSearchHistory: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  watchHistory: [],
  searchHistory: [],
  loading: false,
  error: null,

  loadWatchHistory: async () => {
    try {
      set({ loading: true, error: null });
      const historyJson = await AsyncStorage.getItem(WATCH_HISTORY_KEY);
      const watchHistory = historyJson ? JSON.parse(historyJson) : [];
      set({ watchHistory, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load watch history',
        loading: false,
      });
    }
  },

  loadSearchHistory: async () => {
    try {
      set({ loading: true, error: null });
      const historyJson = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      const searchHistory = historyJson ? JSON.parse(historyJson) : [];
      set({ searchHistory, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load search history',
        loading: false,
      });
    }
  },

  addToWatchHistory: async (movie) => {
    try {
      set({ loading: true, error: null });
      const historyJson = await AsyncStorage.getItem(WATCH_HISTORY_KEY);
      const watchHistory = historyJson ? JSON.parse(historyJson) : [];
      
      if (!watchHistory.some((m: Movie) => m.id === movie.id)) {
        const updatedHistory = [movie, ...watchHistory].slice(0, 50); // Keep last 50 movies
        await AsyncStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updatedHistory));
        set({ watchHistory: updatedHistory, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add to watch history',
        loading: false,
      });
    }
  },

  addToSearchHistory: async (query) => {
    try {
      set({ loading: true, error: null });
      const historyJson = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      const searchHistory = historyJson ? JSON.parse(historyJson) : [];
      
      if (!searchHistory.includes(query)) {
        const updatedHistory = [query, ...searchHistory].slice(0, 10); // Keep last 10 searches
        await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
        set({ searchHistory: updatedHistory, loading: false });
      } else {
        // Move the query to the top if it already exists
        const updatedHistory = [
          query,
          ...searchHistory.filter((q: string) => q !== query),
        ].slice(0, 10);
        await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
        set({ searchHistory: updatedHistory, loading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add to search history',
        loading: false,
      });
    }
  },

  removeFromWatchHistory: async (movieId) => {
    try {
      set({ loading: true, error: null });
      const historyJson = await AsyncStorage.getItem(WATCH_HISTORY_KEY);
      const watchHistory = historyJson ? JSON.parse(historyJson) : [];
      
      const updatedHistory = watchHistory.filter((m: Movie) => m.id !== movieId);
      await AsyncStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updatedHistory));
      set({ watchHistory: updatedHistory, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove from watch history',
        loading: false,
      });
    }
  },

  removeFromSearchHistory: async (query) => {
    try {
      set({ loading: true, error: null });
      const historyJson = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      const searchHistory = historyJson ? JSON.parse(historyJson) : [];
      
      const updatedHistory = searchHistory.filter((q: string) => q !== query);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
      set({ searchHistory: updatedHistory, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove from search history',
        loading: false,
      });
    }
  },

  clearWatchHistory: async () => {
    try {
      set({ loading: true, error: null });
      await AsyncStorage.removeItem(WATCH_HISTORY_KEY);
      set({ watchHistory: [], loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to clear watch history',
        loading: false,
      });
    }
  },

  clearSearchHistory: async () => {
    try {
      set({ loading: true, error: null });
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
      set({ searchHistory: [], loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to clear search history',
        loading: false,
      });
    }
  },

  setError: (error) => {
    set({ error });
  },
})); 