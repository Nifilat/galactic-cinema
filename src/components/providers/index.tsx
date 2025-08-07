'use client';
import React, { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, persistor } from '../../lib/store';
import LoadingSpinner from '../ui/loading-spinner';
import { Toaster } from '../ui/sonner';
import RouteGuard from '../auth/ProtectedRoute';
import { ProvidersProps } from './types';

const Providers: React.FC<ProvidersProps> = ({ children, requireAuth, redirectTo }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 60,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const LoadingScreen = (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={LoadingScreen} persistor={persistor}>
            {requireAuth !== undefined ? (
              <RouteGuard requireAuth={requireAuth} redirectTo={redirectTo}>
                {children}
              </RouteGuard>
            ) : (
              children
            )}
            <Toaster />
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
