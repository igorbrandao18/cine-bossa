import axios from 'axios';
import { API_KEY, BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR'
  }
});

export const tmdbAPI = {
  // Filmes em cartaz
  getNowPlaying: (page = 1) => 
    api.get('/movie/now_playing', { params: { page } }),

  // Filmes populares
  getPopular: (page = 1) => 
    api.get('/movie/popular', { params: { page } }),

  // Próximos lançamentos
  getUpcoming: (page = 1) => 
    api.get('/movie/upcoming', { params: { page } }),

  // Filmes mais bem avaliados
  getTopRated: (page = 1) => 
    api.get('/movie/top_rated', { params: { page } }),

  // Filmes por gênero
  getMoviesByGenre: (genreId: number, page = 1) => 
    api.get('/discover/movie', { 
      params: { 
        page,
        with_genres: genreId,
        sort_by: 'popularity.desc'
      } 
    }),

  // Detalhes do filme
  getMovieDetails: (movieId: number) => 
    api.get(`/movie/${movieId}`),

  // Lista de gêneros
  getGenres: () => 
    api.get('/genre/movie/list'),

  // Buscar filmes
  searchMovies: (query: string, page = 1) => 
    api.get('/search/movie', { params: { query, page } }),

  // Créditos do filme (elenco e equipe)
  getMovieCredits: (movieId: number) => 
    api.get(`/movie/${movieId}/credits`),

  // Vídeos do filme (trailers, teasers, etc)
  getMovieVideos: (movieId: number) => {
    return axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: {
        api_key: API_KEY,
        language: 'pt-BR',
        append_to_response: 'videos'
      }
    });
  },
}; 