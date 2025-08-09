'use client';

import { ReactNode } from 'react';
import { Navigation } from './Navbar';

export default function MoviesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      {children}
    </div>
  );
}
