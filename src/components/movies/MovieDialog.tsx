'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from 'lucide-react';
import { formatDate, getEpisodeTitle, getMoviePoster, getFullOpeningCrawl } from '@/utils';
import ProductionDetails from './ProductionDetails';
import EntitySection from './EntitySection';
import { entitySectionMeta } from '@/constants/movieEntities';
import { MovieDialogProps } from './types';

const MovieDialog = ({ isOpen, onOpenChange, movie }: MovieDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                <ProductionDetails label="Director" value={movie.director} icon={User} />
                <ProductionDetails label="Producer" value={movie.producer} icon={User} />
              </div>
            </div>

            {/* Dynamic Sections */}
            {entitySectionMeta.map(section => (
              <EntitySection
                key={section.key}
                title={section.title}
                icon={section.icon}
                urls={movie[section.key]}
                type={section.type}
              />
            ))}

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
  );
};

export default MovieDialog;
