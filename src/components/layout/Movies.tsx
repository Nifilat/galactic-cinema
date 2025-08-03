'use client';

import { useEffect } from 'react';
import { MovieCard } from '../movies/Moviecard';
import LoadingSpinner from '../movies/LoadingSpinner';
import { Navigation } from './Navbar';
import { useMovies } from '@/hooks/useMovies';
import { toast } from 'sonner';

export default function MoviesPage() {
  const { data: movies = [], isLoading, error } = useMovies();

  useEffect(() => {
    if (movies.length > 0) {
      toast.success('Movies loaded successfully!', {
        description: 'Data fetched from SWAPI.tech API',
      });
    }
  }, [movies]);

  useEffect(() => {
    if (error) {
      toast.warning('Using fallback data', {
        description: 'API unavailable, showing cached movie collection',
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <>
        <Navigation />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black animate-fade-in">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-6xl font-bold text-yellow-400 mb-4 animate-glow">STAR WARS MOVIES</h1>
          <p className="text-gray-300 text-xl animate-fade-in">
            Explore the epic saga that changed cinema forever
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {movies
            .sort((a, b) => a.episode_id - b.episode_id)
            .map((movie, index) => (
              <div
                key={movie.episode_id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
