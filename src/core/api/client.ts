import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { setupInterceptors } from './interceptors';

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptors
setupInterceptors(apiClient); 