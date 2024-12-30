import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: '@user',
  TICKETS: '@tickets',
  PREFERENCES: '@preferences',
  FAVORITES: '@favorites',
  WATCH_HISTORY: '@watch_history',
  SEARCH_HISTORY: '@search_history',
} as const;

class StorageService {
  // User
  async getUser() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async setUser(user: any) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user:', error);
    }
  }

  // Tickets
  async getTickets() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TICKETS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting tickets:', error);
      return [];
    }
  }

  async setTickets(tickets: any[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    } catch (error) {
      console.error('Error setting tickets:', error);
    }
  }

  async addTicket(ticket: any) {
    try {
      const tickets = await this.getTickets();
      tickets.push(ticket);
      await this.setTickets(tickets);
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  }

  // Preferences
  async getPreferences() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return null;
    }
  }

  async setPreferences(preferences: any) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error setting preferences:', error);
    }
  }

  // Favorites
  async getFavorites() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  async addFavorite(movieId: number) {
    try {
      const favorites = await this.getFavorites();
      if (!favorites.includes(movieId)) {
        favorites.push(movieId);
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }

  async removeFavorite(movieId: number) {
    try {
      const favorites = await this.getFavorites();
      const newFavorites = favorites.filter((id: number) => id !== movieId);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  // Watch History
  async getWatchHistory() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WATCH_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting watch history:', error);
      return [];
    }
  }

  async addToWatchHistory(movie: any) {
    try {
      const history = await this.getWatchHistory();
      const newHistory = [
        { ...movie, watchedAt: new Date().toISOString() },
        ...history.filter((item: any) => item.id !== movie.id)
      ].slice(0, 50); // Mantém apenas os últimos 50 filmes
      await AsyncStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error adding to watch history:', error);
    }
  }

  // Search History
  async getSearchHistory() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting search history:', error);
      return [];
    }
  }

  async addToSearchHistory(query: string) {
    try {
      const history = await this.getSearchHistory();
      const newHistory = [
        query,
        ...history.filter((item: string) => item !== query)
      ].slice(0, 10); // Mantém apenas as últimas 10 buscas
      await AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error adding to search history:', error);
    }
  }

  async clearSearchHistory() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }

  // Utility methods
  async clearAll() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export const storage = new StorageService(); 