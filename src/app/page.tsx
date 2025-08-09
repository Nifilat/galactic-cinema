'use client';

import LoadingSpinner from '@/components/ui/loading-spinner';
import { redirect } from 'next/navigation';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <LoadingSpinner size="lg" />
      <button
        onClick={() => redirect('/login')}
        className="px-4 py-2 text-primary-foreground bg-primary text-white rounded-md hover:bg-primary/0.9 transition-colors cursor-pointer border border-ring"
      >
        Go to Login
      </button>
    </div>
  );
}
