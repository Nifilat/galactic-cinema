'use client';
import React, { useEffect, useState } from 'react';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { RouteGuardProps } from './types';
import FullscreenLoader from '../layout/Loader';

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

  if (isLoading) {
    return <FullscreenLoader text="Authenticating..." />;
  }

  const shouldShowContent = requireAuth ? isAuthenticated : !isAuthenticated;

  if (!shouldShowContent) {
    return <FullscreenLoader text="Redirecting..." />;
  }

  return children;
};

export default RouteGuard;
