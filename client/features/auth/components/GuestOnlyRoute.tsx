'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

/** Redirects authenticated users away from login/register. */
export function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/account');
    }
  }, [status, router]);

  if (status === 'idle' || status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center font-body text-ink/70">
        Checking your session…
      </main>
    );
  }

  if (status === 'authenticated') {
    return null;
  }

  return children;
}
