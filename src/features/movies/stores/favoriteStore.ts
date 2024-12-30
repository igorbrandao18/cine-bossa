import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Movie } from '../types/movie';

const STORAGE_KEY = '@cine-bossa:favorites';

interface FavoriteState {
  favorites: Movie[];
  loading: boolean;
  error: string | null;
}

interface FavoriteStore extends FavoriteState {
  loadFavorites: () => Promise<void>;
  addToFavorites: (movie: Movie) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
  clearFavorites: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useFavoriteStore = create<FavoriteStore>((set) => ({
  favorites: [],
  loading: false,
  error: null,

  loadFavorites: async () => {
    try {
      set({ loading: true, error: null });
      const favoritesJson = await AsyncStorage.getItem(STORAGE_KEY);
      const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      set({ favorites, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load favorites',
        loading: false,
      });
    }
  },

  addToFavorites: async (movie) => {
    try {
      set({ loading: true, error: null });
      const favoritesJson = await AsyncStorage.getItem(STORAGE_KEY);
      const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      
      if (!favorites.some((f: Movie) => f.id === movie.id)) {
        const updatedFavorites = [...favorites, movie];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
        set({ favorites: updatedFavorites, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add to favorites',
        loading: false,
      });
    }
  },

  removeFromFavorites: async (movieId) => {
    try {
      set({ loading: true, error: null });
      const favoritesJson = await AsyncStorage.getItem(STORAGE_KEY);
      const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      
      const updatedFavorites = favorites.filter((f: Movie) => f.id !== movieId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
      set({ favorites: updatedFavorites, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove from favorites',
        loading: false,
      });
    }
  },

  clearFavorites: async () => {
    try {
      set({ loading: true, error: null });
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ favorites: [], loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to clear favorites',
        loading: false,
      });
    }
  },

  setError: (error) => {
    set({ error });
  },
})); 