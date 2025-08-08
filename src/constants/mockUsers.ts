export const mockUsers = [
  {
    id: '1',
    username: 'luke',
    password: process.env.NEXT_PUBLIC_LUKE_PASSWORD || '',
    email: 'luke@starwars.com',
  },
  {
    id: '2',
    username: 'leia',
    password: process.env.NEXT_PUBLIC_LEIA_PASSWORD || '',
    email: 'leia@starwars.com',
  },
  {
    id: '3',
    username: 'han',
    password: process.env.NEXT_PUBLIC_HAN_PASSWORD || '',
    email: 'han@starwars.com',
  },
  {
    id: '4',
    username: 'admin',
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '',
    email: 'admin@starwars.com',
  },
];
console.log('Loaded mock users:', mockUsers);
