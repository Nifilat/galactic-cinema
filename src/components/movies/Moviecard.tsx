'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Info } from 'lucide-react';
import { MovieCardProps } from '@/types';
import { formatDate, truncateText, getEpisodeTitle, getMoviePoster } from '@/utils';
import MovieDialog from './MovieDialog';

export function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card
      className={`bg-gray-900/80 border-gray-700 transition-all duration-300 cursor-pointer group overflow-hidden h-[500px] flex flex-col delay-[0.3s] ${
        isHovered ? 'transform scale-105 shadow-2xl shadow-yellow-400/20 border-yellow-400/50' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie poster - fixed height */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 opacity-20 group-hover:opacity-80 transition-opacity duration-300">
          <Image
            src={getMoviePoster(movie.episode_id, movie.title)}
            alt={`${movie.title} poster`}
            fill
            className="object-cover"
            crossOrigin="anonymous"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
      </div>

      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-yellow-400 font-semibold">
            {getEpisodeTitle(movie.episode_id)}
          </span>
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(movie.release_date)}
          </div>
        </div>
        <CardTitle className="text-xl text-white group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2">
          {movie.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 flex-1 flex flex-col justify-between">
        <CardDescription className="text-gray-300 mb-4 leading-relaxed flex-1">
          {truncateText(movie.opening_crawl, 120)}
        </CardDescription>

        <Button
          variant="outline"
          size="sm"
          className="w-full border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 bg-transparent mt-auto"
          onClick={() => setIsModalOpen(true)}
        >
          <Info className="h-4 w-4 mr-2" />
          More Info
        </Button>

        <MovieDialog isOpen={isModalOpen} onOpenChange={setIsModalOpen} movie={movie} />
      </CardContent>
    </Card>
  );
}
