'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@marriage/shared';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { useAppSelector } from '@/store/hooks';

export function AdminOnlyRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminGate>{children}</AdminGate>
    </ProtectedRoute>
  );
}

function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    if (status === 'authenticated' && user && !isAdmin) {
      router.replace('/account');
    }
  }, [status, user, isAdmin, router]);

  if (!user || !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center font-body text-ink/70">
        Checking admin access…
      </main>
    );
  }

  return children;
}
