import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MoviesState, Movie, MoviesResponse } from '../types';

const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
};

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const response = await fetch('https://swapi.tech/api/films');
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  const data: MoviesResponse = await response.json();
  return data.result;
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMovies.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.loading = false;
        state.movies = action.payload.sort(
          (a, b) => a.properties.episode_id - b.properties.episode_id
        );
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      });
  },
});

export const { clearError } = moviesSlice.actions;
export default moviesSlice.reducer;
