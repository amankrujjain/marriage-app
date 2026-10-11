'use client';

import { Suspense } from 'react';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { GuestOnlyRoute } from '@/features/auth/components/GuestOnlyRoute';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <GuestOnlyRoute>
      <AuthShell title="Sign in">
        <Suspense fallback={<p className="font-body text-ink/60">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </AuthShell>
    </GuestOnlyRoute>
  );
}
