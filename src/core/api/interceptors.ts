import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api';

export const setupInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add API key to all requests
      config.params = {
        ...config.params,
        api_key: API_CONFIG.apiKey,
        language: API_CONFIG.language,
      };
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        // Handle specific API errors
        switch (error.response.status) {
          case 401:
            console.error('Unauthorized: Invalid API key');
            break;
          case 404:
            console.error('Resource not found');
            break;
          case 429:
            console.error('Rate limit exceeded');
            break;
          default:
            console.error('API Error:', error.response.data);
        }
      } else if (error.request) {
        // Network error
        console.error('Network Error:', error.message);
      } else {
        console.error('Error:', error.message);
      }
      return Promise.reject(error);
    }
  );
}; 