'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RootState } from '@/lib/store';
import LoadingSpinner from '../components/ui/loading-spinner';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
