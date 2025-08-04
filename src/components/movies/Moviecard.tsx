'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Info, User, Rocket, Car, Globe, Users } from 'lucide-react';
import { useEntityNames } from '@/hooks/useMovies';
import { MovieCardProps } from '@/types';
import { formatDate, truncateText, getEpisodeTitle, getMoviePoster, getFullOpeningCrawl } from '@/utils';
import LoadingSpinner from '@/components/ui/loading-spinner';

const EntitySection = ({
  title,
  icon: Icon,
  urls,
  type,
}: {
  title: string;
  icon: React.ElementType;
  urls: string[];
  type: string;
}) => {
  const { data: names = [], isLoading } = useEntityNames(urls, type);

  return (
    <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
      <h3 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center">
        <Icon className="h-6 w-6 mr-3" />
        {title} ({urls.length})
      </h3>
      <ScrollArea className="h-32">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <LoadingSpinner size="sm" showText={false} />
          </div>
        ) : names.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No {type} found</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {names.map((name, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-yellow-900/30 text-yellow-300 border-yellow-700"
              >
                {name}
              </Badge>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card
      className={`bg-gray-900/80 border-gray-700 transition-all duration-300 cursor-pointer group overflow-hidden h-[500px] flex flex-col ${
        isHovered ? 'transform scale-105 shadow-2xl shadow-yellow-400/20 border-yellow-400/50' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie poster - fixed height */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 bg-transparent mt-auto"
            >
              <Info className="h-4 w-4 mr-2" />
              More Info
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-3xl text-yellow-400 mb-2">
                {getEpisodeTitle(movie.episode_id)}: {movie.title}
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-lg">
                Released on {formatDate(movie.release_date)}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
              {/* Movie Poster */}
              <div className="lg:col-span-2">
                <div className="sticky top-4">
                  <Image
                    src={getMoviePoster(movie.episode_id, movie.title)}
                    alt={`${movie.title} poster`}
                    width={500}
                    height={800}
                    className="w-full rounded-xl shadow-2xl shadow-yellow-400/10 border border-gray-700"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>

              {/* Movie Details */}
              <div className="lg:col-span-3 space-y-8">
                {/* Production Info */}
                <div className="bg-card/30 p-6 rounded-xl border border-border">
                  <h3 className="text-xl font-semibold text-primary mb-4">Production Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-foreground">
                      <User className="h-5 w-5 mr-3 text-primary" />
                      <span className="font-medium text-lg">Director:</span>
                      <span className="ml-3 text-lg">{movie.director}</span>
                    </div>
                    <div className="flex items-center text-foreground">
                      <User className="h-5 w-5 mr-3 text-primary" />
                      <span className="font-medium text-lg">Producer:</span>
                      <span className="ml-3 text-lg">{movie.producer}</span>
                    </div>
                  </div>
                </div>

                {/* Characters */}
                <EntitySection
                  title="Characters"
                  icon={Users}
                  urls={movie.characters}
                  type="characters"
                />

                {/* Starships */}
                <EntitySection
                  title="Starships"
                  icon={Rocket}
                  urls={movie.starships}
                  type="starships"
                />

                {/* Vehicles */}
                <EntitySection title="Vehicles" icon={Car} urls={movie.vehicles} type="vehicles" />

                {/* Planets */}
                <EntitySection title="Planets" icon={Globe} urls={movie.planets} type="planets" />

                {/* Opening Crawl */}
                <div className="bg-card/30 p-6 rounded-xl border border-border">
                  <h3 className="text-xl font-semibold text-primary mb-4">Opening Crawl</h3>
                  <ScrollArea className="h-64">
                    <div className="bg-muted/50 p-6 rounded-lg border border-border">
                      <pre className="text-foreground whitespace-pre-wrap text-base leading-relaxed font-mono">
                        {getFullOpeningCrawl(movie.opening_crawl)}
                      </pre>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}