'use client';
import React, { useEffect, useState } from 'react';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { RouteGuardProps } from './types';

const RouteGuard: React.FC<RouteGuardProps> = ({ children, requireAuth = true, redirectTo }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);

      const shouldRedirect = requireAuth ? !isAuthenticated : isAuthenticated;

      if (shouldRedirect && redirectTo) {
        router.replace(redirectTo);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router, requireAuth, redirectTo]);

  const LoadingScreen = (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );

  if (isLoading) {
    return LoadingScreen;
  }

  const shouldShowContent = requireAuth ? isAuthenticated : !isAuthenticated;

  if (!shouldShowContent) {
    return LoadingScreen;
  }

  return children;
};

export default RouteGuard;
