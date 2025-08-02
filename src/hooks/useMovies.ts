import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState, AppDispatch } from '../lib/store';
import { fetchMovies, clearError } from '@/lib/store/movieSlice';

export const useMovies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const movies = useSelector((state: RootState) => state.movies);

  useEffect(() => {
    if (movies.movies.length === 0 && !movies.loading) {
      dispatch(fetchMovies());
    }
  }, [dispatch, movies.movies.length, movies.loading]);

  const refetchMovies = () => {
    dispatch(fetchMovies());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    ...movies,
    refetchMovies,
    clearError: handleClearError,
  };
};
