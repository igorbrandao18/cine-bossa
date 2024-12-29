import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@cinebossa:';
const CACHE_EXPIRATION = 30 * 60 * 1000; // 30 minutos

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export const cache = {
  async set<T>(key: string, data: T): Promise<void> {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(
        CACHE_PREFIX + key, 
        JSON.stringify(item)
      );
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(CACHE_PREFIX + key);
      if (!item) return null;

      const cached: CacheItem<T> = JSON.parse(item);
      const isExpired = Date.now() - cached.timestamp > CACHE_EXPIRATION;

      if (isExpired) {
        await AsyncStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }

      return cached.data;
    } catch (error) {
      console.warn('Cache read error:', error);
      return null;
    }
  },

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }
}; 