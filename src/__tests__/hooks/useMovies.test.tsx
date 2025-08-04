import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, createElement } from 'react';
import { useMovies, useEntityNames } from '@/hooks/useMovies';

global.fetch = jest.fn();

const mockMoviesResponse = {
  result: [
    {
      properties: {
        title: 'A New Hope',
        episode_id: 4,
        opening_crawl: 'It is a period of civil war...',
        release_date: '1977-05-25',
        url: 'https://swapi.tech/api/films/1',
        director: 'George Lucas',
        producer: 'Gary Kurtz, Rick McCallum',
        characters: ['https://swapi.tech/api/people/1'],
        starships: ['https://swapi.tech/api/starships/1'],
        vehicles: ['https://swapi.tech/api/vehicles/1'],
        planets: ['https://swapi.tech/api/planets/1'],
        species: ['https://swapi.tech/api/species/1'],
        created: '2014-12-10T14:23:31.880000Z',
        edited: '2014-12-20T19:49:45.256000Z',
      },
    },
  ],
};

const mockEntityResponse = {
  result: {
    properties: {
      name: 'Luke Skywalker',
    },
  },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useMovies', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  it('should fetch movies successfully', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMoviesResponse,
    } as Response);

    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0]).toEqual(mockMoviesResponse.result[0].properties);
    expect(mockFetch).toHaveBeenCalledWith('https://www.swapi.tech/api/films');
  });

  it('should return fallback data when API fails', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockRejectedValueOnce(new Error('API Error'));

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(6);
    expect(result.current.data?.[0].title).toBe('A New Hope');
    expect(consoleSpy).toHaveBeenCalledWith(
      'API fetch failed, using fallback data:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should handle invalid response format', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ invalid: 'data' }),
    } as Response);

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(6);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle non-ok response', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(6);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

describe('useEntityNames', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  it('should fetch entity names successfully', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockEntityResponse,
    } as Response);

    const urls = ['https://swapi.tech/api/people/1', 'https://swapi.tech/api/people/2'];

    const { result } = renderHook(() => useEntityNames(urls, 'characters'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(['Luke Skywalker', 'Luke Skywalker']);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should return undefined for empty URLs (query disabled)', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

    const { result } = renderHook(() => useEntityNames([], 'characters'), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should handle failed entity requests gracefully', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntityResponse,
      } as Response)
      .mockRejectedValueOnce(new Error('API Error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const urls = ['https://swapi.tech/api/people/1', 'https://swapi.tech/api/people/2'];

    const { result } = renderHook(() => useEntityNames(urls, 'characters'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(['Luke Skywalker']);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should limit URLs to 10 items', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockEntityResponse,
    } as Response);

    const urls = Array.from({ length: 15 }, (_, i) => `https://swapi.tech/api/people/${i + 1}`);

    const { result } = renderHook(() => useEntityNames(urls, 'characters'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockFetch).toHaveBeenCalledTimes(10);
  });

  it('should not run query when URLs array is empty', () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

    const { result } = renderHook(() => useEntityNames([], 'characters'), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);

    expect(mockFetch).not.toHaveBeenCalled();
  });
});
