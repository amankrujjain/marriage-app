'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (status === 'anonymous') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'idle' || status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center font-body text-ink/70">
        Checking your session…
      </main>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  return children;
}
