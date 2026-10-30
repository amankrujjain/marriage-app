'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { SpokeFaith } from '@/content/spokes/types';

type SpokePresetContextValue = {
  faith?: SpokeFaith;
};

const SpokePresetContext = createContext<SpokePresetContextValue>({});

export function SpokePresetProvider({
  faith,
  children,
}: {
  faith?: SpokeFaith;
  children: ReactNode;
}) {
  return (
    <SpokePresetContext.Provider value={{ faith }}>
      {children}
    </SpokePresetContext.Provider>
  );
}

export function useSpokePresetFaith(): SpokeFaith | undefined {
  return useContext(SpokePresetContext).faith;
}
