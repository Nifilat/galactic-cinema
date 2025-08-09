import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncateText(text: string, maxLength: number = 150): string {
  const cleanText = text.replace(/\r\n/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.substring(0, maxLength) + '...';
}

export function generateToken(): string {
  return btoa(Date.now().toString() + Math.random().toString());
}

export function getEpisodeTitle(episodeId: number): string {
  const episodeMap: Record<number, string> = {
    1: 'Episode I',
    2: 'Episode II',
    3: 'Episode III',
    4: 'Episode IV',
    5: 'Episode V',
    6: 'Episode VI',
  };
  return episodeMap[episodeId] || `Episode ${episodeId}`;
}

export function getMoviePoster(episodeId: number, title: string): string {
  const posterUrls: Record<number, string> = {
    1: '/images/episode-I-poster.jpg',
    2: '/images/episode-2-poster.jpg',
    3: '/images/episode-3-poster.jpg',
    4: '/images/episode-4-poster.jpg',
    5: '/images/episode-5-poster.jpg',
    6: '/images/episode-6-poster.jpg',
  };

  return (
    posterUrls[episodeId] ||
    `/placeholder.svg?height=600&width=400&query=${encodeURIComponent(title + ' Star Wars movie poster')}`
  );
}

export function getFullOpeningCrawl(text: string): string {
  return text.replace(/\r\n/g, '\n').trim();
}
