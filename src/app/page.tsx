'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/movies/LoadingSpinner';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/movies');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return <LoadingSpinner size="lg" text="Redirecting..." />;
}