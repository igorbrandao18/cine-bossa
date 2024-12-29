export const API_KEY = 'c90bcc69290d26ceb456609c8e38227d';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original'
};

// Adicione isso para debug
console.log('API Config:', {
  BASE_URL,
  API_KEY: API_KEY.substring(0, 4) + '...' // Por segurança, não logue a chave inteira
}); 