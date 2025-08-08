import React from 'react';
import LoadingSpinner from '../ui/loading-spinner';
import { FullscreenLoaderProps } from '@/types';

const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({
  size = 'lg',
  showText = true,
  text = 'Loading the galaxy...',
  className = '',
}) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center ${className}`}
    >
      <LoadingSpinner size={size} showText={showText} text={text} />
    </div>
  );
};

export default FullscreenLoader;
