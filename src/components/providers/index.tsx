'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../../lib/store';
import LoadingSpinner from '../movies/LoadingSpinner';
import { Toaster } from '../ui/sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        {children}
        <Toaster />
      </PersistGate>
    </Provider>
  );
};

export default Providers;
