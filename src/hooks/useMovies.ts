import { useQuery } from '@tanstack/react-query';

export interface Movie {
  title: string;
  episode_id: number;
  opening_crawl: string;
  release_date: string;
  url: string;
  director: string;
  producer: string;
  characters: string[];
  starships: string[];
  vehicles: string[];
  planets: string[];
  species: string[];
  created: string;
  edited: string;
}

interface SwapiResponse {
  message: string;
  result: Array<{
    properties: Movie;
    description: string;
    _id: string;
    uid: string;
    __v: number;
  }>;
}

interface ApiItem {
  message: string;
  result: {
    properties: {
      name: string;
      [key: string]: unknown;
    };
  };
}

const fallbackMovies: Movie[] = [
  {
    title: 'A New Hope',
    episode_id: 4,
    opening_crawl:
      "It is a period of civil war.\r\n\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
    release_date: '1977-05-25',
    url: 'https://swapi.tech/api/films/1',
    director: 'George Lucas',
    producer: 'Gary Kurtz, Rick McCallum',
    characters: Array(18)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/people/${i + 1}`),
    starships: Array(8)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/starships/${i + 1}`),
    vehicles: Array(4)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/vehicles/${i + 1}`),
    planets: Array(3)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/planets/${i + 1}`),
    species: Array(5)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/species/${i + 1}`),
    created: '2014-12-10T14:23:31.880000Z',
    edited: '2014-12-20T19:49:45.256000Z',
  },
  {
    title: 'The Empire Strikes Back',
    episode_id: 5,
    opening_crawl:
      'It is a dark time for the\r\nRebellion. Although the Death\r\nStar has been destroyed,\r\nImperial troops have driven the\r\nRebel forces from their hidden\r\nbase and pursued them across\r\nthe galaxy.\r\n\r\nEvading the dreaded Imperial\r\nStarfleet, a group of freedom\r\nfighters led by Luke Skywalker\r\nhas established a new secret\r\nbase on the remote ice world\r\nof Hoth.\r\n\r\nThe evil lord Darth Vader,\r\nobsessed with finding young\r\nSkywalker, has dispatched\r\nthousands of remote probes into\r\nthe far reaches of space....',
    release_date: '1980-05-17',
    url: 'https://swapi.tech/api/films/2',
    director: 'Irvin Kershner',
    producer: 'Gary Kurtz, Rick McCallum',
    characters: Array(16)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/people/${i + 1}`),
    starships: Array(10)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/starships/${i + 1}`),
    vehicles: Array(8)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/vehicles/${i + 1}`),
    planets: Array(4)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/planets/${i + 1}`),
    species: Array(6)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/species/${i + 1}`),
    created: '2014-12-12T11:26:24.656000Z',
    edited: '2014-12-15T13:07:53.386000Z',
  },
  {
    title: 'Return of the Jedi',
    episode_id: 6,
    opening_crawl:
      'Luke Skywalker has returned to\r\nhis home planet of Tatooine in\r\nan attempt to rescue his\r\nfriend Han Solo from the\r\nclutches of the vile gangster\r\nJabba the Hutt.\r\n\r\nLittle does Luke know that the\r\nGALACTIC EMPIRE has secretly\r\nbegun construction on a new\r\narmored space station even\r\nmore powerful than the first\r\ndreaded Death Star.\r\n\r\nWhen completed, this ultimate\r\nweapon will spell certain\r\ndoom for the small band of\r\nrebels struggling to restore\r\nfreedom to the galaxy...',
    release_date: '1983-05-25',
    url: 'https://swapi.tech/api/films/3',
    director: 'Richard Marquand',
    producer: 'Howard G. Kazanjian, George Lucas, Rick McCallum',
    characters: Array(20)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/people/${i + 1}`),
    starships: Array(9)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/starships/${i + 1}`),
    vehicles: Array(8)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/vehicles/${i + 1}`),
    planets: Array(5)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/planets/${i + 1}`),
    species: Array(9)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/species/${i + 1}`),
    created: '2014-12-18T10:39:33.255000Z',
    edited: '2014-12-20T09:48:37.462000Z',
  },
  {
    title: 'The Phantom Menace',
    episode_id: 1,
    opening_crawl:
      'Turmoil has engulfed the\r\nGalactic Republic. The taxation\r\nof trade routes to outlying star\r\nsystems is in dispute.\r\n\r\nHoping to resolve the matter\r\nwith a blockade of deadly\r\nbattleships, the greedy Trade\r\nFederation has stopped all\r\nshipping to the small planet\r\nof Naboo.\r\n\r\nWhile the Congress of the\r\nRepublic endlessly debates\r\nthis alarming chain of events,\r\nthe Supreme Chancellor has\r\nsecretly dispatched two Jedi\r\nKnights, the guardians of\r\npeace and justice in the\r\ngalaxy, to settle the conflict....',
    release_date: '1999-05-19',
    url: 'https://swapi.tech/api/films/4',
    director: 'George Lucas',
    producer: 'Rick McCallum',
    characters: Array(34)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/people/${i + 1}`),
    starships: Array(5)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/starships/${i + 1}`),
    vehicles: Array(7)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/vehicles/${i + 1}`),
    planets: Array(3)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/planets/${i + 1}`),
    species: Array(6)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/species/${i + 1}`),
    created: '2014-12-19T16:52:55.740000Z',
    edited: '2014-12-20T10:54:07.216000Z',
  },
  {
    title: 'Attack of the Clones',
    episode_id: 2,
    opening_crawl:
      'There is unrest in the Galactic\r\nSenate. Several thousand solar\r\nsystems have declared their\r\nintentions to leave the Republic.\r\n\r\nThis separatist movement,\r\nunder the leadership of the\r\nmysterious Count Dooku, has\r\nmade it difficult for the limited\r\nnumber of Jedi Knights to maintain \r\npeace and order in the galaxy.\r\n\r\nSenator Amidala, the former\r\nQueen of Naboo, is returning\r\nto the Galactic Senate to vote\r\non the critical issue of creating\r\nan ARMY OF THE REPUBLIC\r\nto assist the overwhelmed\r\nJedi....',
    release_date: '2002-05-16',
    url: 'https://swapi.tech/api/films/5',
    director: 'George Lucas',
    producer: 'Rick McCallum',
    characters: Array(40)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/people/${i + 1}`),
    starships: Array(6)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/starships/${i + 1}`),
    vehicles: Array(4)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/vehicles/${i + 1}`),
    planets: Array(6)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/planets/${i + 1}`),
    species: Array(12)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/species/${i + 1}`),
    created: '2014-12-20T10:57:57.886000Z',
    edited: '2014-12-20T20:18:48.516000Z',
  },
  {
    title: 'Revenge of the Sith',
    episode_id: 3,
    opening_crawl:
      'War! The Republic is crumbling\r\nunder attacks by the ruthless\r\nSith Lord, Count Dooku.\r\nThere are heroes on both sides.\r\nEvil is everywhere.\r\n\r\nIn a stunning move, the\r\nfiendish droid leader, General\r\nGrievous, has swept into the\r\nRepublic capital and kidnapped\r\nChancellor Palpatine, leader of\r\nthe Galactic Senate.\r\n\r\nAs the Separatist Droid Army\r\nattempts to flee the besieged\r\ncapital with their valuable\r\nhostage, two Jedi Knights lead a\r\ndesperate mission to rescue the\r\ncaptive Chancellor....',
    release_date: '2005-05-19',
    url: 'https://swapi.tech/api/films/6',
    director: 'George Lucas',
    producer: 'Rick McCallum',
    characters: Array(34)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/people/${i + 1}`),
    starships: Array(12)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/starships/${i + 1}`),
    vehicles: Array(13)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/vehicles/${i + 1}`),
    planets: Array(13)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/planets/${i + 1}`),
    species: Array(20)
      .fill('')
      .map((_, i) => `https://swapi.tech/api/species/${i + 1}`),
    created: '2005-12-20T18:49:13.748000Z',
    edited: '2014-12-20T20:47:52.073000Z',
  },
];

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

    return data.result.map(item => item.properties);
  } catch (error) {
    console.warn('API fetch failed, using fallback data:', error);
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
