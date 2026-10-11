'use client';

import { Suspense } from 'react';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { GuestOnlyRoute } from '@/features/auth/components/GuestOnlyRoute';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <GuestOnlyRoute>
      <AuthShell title="Create account">
        <Suspense fallback={<p className="font-body text-ink/60">Loading…</p>}>
          <RegisterForm />
        </Suspense>
      </AuthShell>
    </GuestOnlyRoute>
  );
}
