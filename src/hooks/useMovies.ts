import { useQuery } from '@tanstack/react-query';
import { Movie, SwapiResponse, ApiItem } from '@/types';
import { fallbackMovies } from '@/constants/fallbackMovies';
import { toast } from 'sonner';

const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch('https://www.swapi.tech/api/films');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SwapiResponse = await response.json();

    if (!data.result || !Array.isArray(data.result)) {
      throw new Error('Invalid data format received from API');
    }

    toast.success('Movies loaded successfully!', {
      description: 'Data fetched from SWAPI.tech API',
    });

    return data.result.map(item => item.properties);
  } catch (error) {
    console.warn('API fetch failed, using fallback data:', error);

    toast.warning('Using fallback data', {
      description: 'API unavailable, showing cached movie collection',
    });

    return fallbackMovies;
  }
};

const fetchEntityNames = async (urls: string[]): Promise<string[]> => {
  if (!urls.length) return [];

  try {
    const limitedUrls = urls.slice(0, 10);
    const promises = limitedUrls.map(async url => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const data: ApiItem = await response.json();
        return data.result.properties.name;
      } catch (error) {
        console.error(`Error fetching from ${url}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((name): name is string => name !== null);
  } catch (error) {
    console.error('Error fetching entity names:', error);
    return [];
  }
};

export const useMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useEntityNames = (urls: string[], type: string) => {
  return useQuery({
    queryKey: ['entityNames', type, urls],
    queryFn: () => fetchEntityNames(urls),
    enabled: urls.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
