import axios from 'axios';

const API_KEY = 'c90bcc69290d26ceb456609c8e38227d';

if (!API_KEY) {
  throw new Error('TMDB API Key não encontrada');
}

export const API_CONFIG = {
  baseUrl: 'https://api.themoviedb.org/3',
  imageBaseUrl: 'https://image.tmdb.org/t/p',
  apiKey: API_KEY,
  language: 'pt-BR',
  region: 'BR'
};

export const SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  }
};

// Cria instância do axios com configurações base
export const tmdbAPI = axios.create({
  baseURL: API_CONFIG.baseUrl,
  params: {
    api_key: API_KEY,
    language: API_CONFIG.language,
    region: API_CONFIG.region
  }
});

// Interceptors para debug
tmdbAPI.interceptors.request.use(
  config => {
    if (__DEV__) {
      console.log('🔍 API Request:', {
        url: config.url,
        method: config.method,
        params: {
          ...config.params,
          api_key: config.params.api_key.slice(0, 4) + '...'
        }
      });
    }
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

tmdbAPI.interceptors.response.use(
  response => response,
  error => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.status_message
    });
    return Promise.reject(error);
  }
);

export const createImageUrl = (path: string, size: string) => 
  `${API_CONFIG.imageBaseUrl}/${size}${path}`; 