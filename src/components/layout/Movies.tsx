'use client';

import { MovieCard } from '../movies/Moviecard';
import LoadingSpinner from '../ui/loading-spinner';
import { useMovies } from '@/hooks/useMovies';
import MoviesLayout from './MoviesLayout';

export default function MoviesPage() {
  const { data: movies = [], isLoading, error } = useMovies();

  if (isLoading) {
    return (
      <MoviesLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <LoadingSpinner size="lg" />
        </div>
      </MoviesLayout>
    );
  }

  return (
    <MoviesLayout>
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-4 animate-glow">
            STAR WARS MOVIES
          </h1>

          <p className="text-gray-300 text-xl animate-fade-in">
            Explore the epic saga that changed cinema forever
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies
            .sort((a, b) => a.episode_id - b.episode_id)
            .map((movie, index) => (
              <MovieCard key={movie.episode_id} movie={movie} index={index} />
            ))}
        </div>
      </main>
    </MoviesLayout>
  );
}
