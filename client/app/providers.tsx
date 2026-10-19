'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from '@/store/store';
import { AuthBootstrap } from '@/features/auth/components/AuthBootstrap';
import { AppLoader } from '@/components/AppLoader';

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <AuthBootstrap>
        {children}
        <AppLoader />
      </AuthBootstrap>
    </Provider>
  );
}
