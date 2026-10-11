'use client';

import { Suspense } from 'react';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { GuestOnlyRoute } from '@/features/auth/components/GuestOnlyRoute';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <GuestOnlyRoute>
      <AuthShell title="Sign in" subtitle="Welcome back! Please sign in to continue.">
        <Suspense fallback={<p className="note">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </AuthShell>
    </GuestOnlyRoute>
  );
}
