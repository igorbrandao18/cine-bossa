export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieSection {
  title: string;
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

export interface MovieState {
  sections: {
    trending: MovieSection;
    nowPlaying: MovieSection;
    popular: MovieSection;
    upcoming: MovieSection;
    topRated: MovieSection;
    action: MovieSection;
    comedy: MovieSection;
    horror: MovieSection;
    romance: MovieSection;
    documentary: MovieSection;
  };
  genres: Genre[];
  loading: boolean;
  error: string | null;
} 