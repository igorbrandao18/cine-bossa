export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  adult: boolean;
  video: boolean;
}

export interface MovieSection {
  data: Movie[];
  page: number;
  totalPages: number;
  loading?: boolean;
  error?: string | null;
}

export interface MovieState {
  sections: {
    nowPlaying: MovieSection;
    popular: MovieSection;
    upcoming: MovieSection;
    topRated: MovieSection;
  };
  loading: boolean;
  error: string | null;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
} 