import axios from 'axios';
import { API_CONFIG } from '@/core/config/api';

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  params: {
    api_key: API_CONFIG.apiKey,
    language: 'pt-BR',
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add any request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common API errors here
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        case 429:
          // Handle rate limit
          console.error('Rate limit exceeded');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
); 