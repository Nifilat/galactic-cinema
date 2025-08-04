export const mockUsers = [
  {
    id: '1',
    username: 'luke',
    password: process.env.LUKE_PASSWORD || '',
    email: 'luke@starwars.com',
  },
  {
    id: '2',
    username: 'leia',
    password: process.env.LEIA_PASSWORD || '',
    email: 'leia@starwars.com',
  },
  { id: '3', username: 'han', password: process.env.HAN_PASSWORD || '', email: 'han@starwars.com' },
  {
    id: '4',
    username: 'admin',
    password: process.env.ADMIN_PASSWORD || '',
    email: 'admin@starwars.com',
  },
];
