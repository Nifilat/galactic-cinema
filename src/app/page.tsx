'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RootState } from '@/lib/store';
import LoadingSpinner from '../components/movies/LoadingSpinner';
import { useSelector } from 'react-redux';

export default function HomePage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/movies');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return <LoadingSpinner />;
}
