'use client';

import { useDesignsBootstrap } from '@/features/designs/hooks/useDesignsBootstrap';
import { useAuthBootstrap } from '../hooks/useAuthBootstrap';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  useAuthBootstrap();
  useDesignsBootstrap();
  return children;
}
