export const API_KEY = 'c90bcc69290d26ceb456609c8e38227d';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original'
} as const;

export const BACKDROP_SIZES = {
  small: 'w300',
  medium: 'w780',
  large: 'w1280',
  original: 'original'
} as const;

export const YOUTUBE_THUMBNAIL = {
  default: 'https://img.youtube.com/vi/{videoId}/default.jpg',
  medium: 'https://img.youtube.com/vi/{videoId}/mqdefault.jpg',
  high: 'https://img.youtube.com/vi/{videoId}/hqdefault.jpg',
  standard: 'https://img.youtube.com/vi/{videoId}/sddefault.jpg',
  maxres: 'https://img.youtube.com/vi/{videoId}/maxresdefault.jpg',
} as const;

// Adicione isso para debug
console.log('API Config:', {
  BASE_URL,
  API_KEY: API_KEY.substring(0, 4) + '...' // Por segurança, não logue a chave inteira
}); 