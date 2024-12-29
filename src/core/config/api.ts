export const API_CONFIG = {
  baseUrl: 'https://api.themoviedb.org/3',
  imageBaseUrl: 'https://image.tmdb.org/t/p',
  apiKey: process.env.EXPO_PUBLIC_TMDB_API_KEY,
  language: 'pt-BR',
} as const;

export const SIZES = {
  backdrop: {
    w300: 'w300',
    w780: 'w780',
    w1280: 'w1280',
    original: 'original',
  },
  poster: {
    w92: 'w92',
    w154: 'w154',
    w185: 'w185',
    w342: 'w342',
    w500: 'w500',
    w780: 'w780',
    original: 'original',
  },
} as const; 