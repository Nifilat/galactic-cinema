export interface Movie {
  title: string;
  episode_id: number;
  opening_crawl: string;
  release_date: string;
  url: string;
  director: string;
  producer: string;
  characters: string[];
  starships: string[];
  vehicles: string[];
  planets: string[];
  species: string[];
  created: string;
  edited: string;
}

export interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export interface SwapiResponse {
  message: string;
  result: Array<{
    properties: Movie;
    description: string;
    _id: string;
    uid: string;
    __v: number;
  }>;
}

export interface ApiItem {
  message: string;
  result: {
    properties: {
      name: string;
      [key: string]: unknown;
    };
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  users: User[];
}

export interface User {
  id: string;
  username: string;
  email?: string;
  password: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface MoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  movies: MoviesState;
}

export interface LoadingState {
  characters: boolean;
  starships: boolean;
  vehicles: boolean;
  planets: boolean;
}
