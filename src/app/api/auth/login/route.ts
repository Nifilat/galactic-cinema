import { NextRequest, NextResponse } from 'next/server';

const mockUsers = [
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

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const user = mockUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Return user without password
    const { ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
