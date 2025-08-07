'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useEntityNames } from '@/hooks/useMovies';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { EntitySectionProps } from './types';

const EntitySection = ({ title, icon: Icon, urls, type }: EntitySectionProps) => {
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

export default EntitySection;
