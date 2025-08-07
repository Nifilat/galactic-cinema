import { Users, Rocket, Car, Globe } from 'lucide-react';

export const entitySectionMeta = [
  {
    title: 'Characters',
    icon: Users,
    key: 'characters',
    type: 'characters',
  },
  {
    title: 'Starships',
    icon: Rocket,
    key: 'starships',
    type: 'starships',
  },
  {
    title: 'Vehicles',
    icon: Car,
    key: 'vehicles',
    type: 'vehicles',
  },
  {
    title: 'Planets',
    icon: Globe,
    key: 'planets',
    type: 'planets',
  },
] as const;
