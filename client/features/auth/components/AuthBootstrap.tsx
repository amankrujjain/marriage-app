'use client';

import { useAuthBootstrap } from '../hooks/useAuthBootstrap';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  useAuthBootstrap();
  return children;
}
