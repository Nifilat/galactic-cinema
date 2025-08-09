'use client';
import React, { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, persistor } from '../../lib/store';
import { Toaster } from '../ui/sonner';
import RouteGuard from '../auth/ProtectedRoute';
import { ProvidersProps } from './types';
import FullscreenLoader from '../layout/Loader';

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

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate
            loading={<FullscreenLoader text="Initializing application" />}
            persistor={persistor}
          >
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
