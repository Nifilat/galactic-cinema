'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../lib/store';
import LoadingSpinner from '../components/movies/LoadingSpinner';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner size="lg" text="Initializing app..." />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default Providers;