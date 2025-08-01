export interface Movie {
  uid: string;
  properties: {
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: string;
    characters: string[];
    planets: string[];
    starships: string[];
    vehicles: string[];
    species: string[];
    created: string;
    edited: string;
    url: string;
  };
}

export interface MoviesResponse {
  message: string;
  result: Movie[];
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string;
  token: string | null;
}

export interface RootState {
  auth: AuthState;
  movies: MoviesState;
}

export interface MoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}
