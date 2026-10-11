'use client';

import { Suspense } from 'react';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { GuestOnlyRoute } from '@/features/auth/components/GuestOnlyRoute';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <GuestOnlyRoute>
      <AuthShell
        title="Create account"
        subtitle="Save your biodatas and come back to edit them any time."
      >
        <Suspense fallback={<p className="note">Loading…</p>}>
          <RegisterForm />
        </Suspense>
      </AuthShell>
    </GuestOnlyRoute>
  );
}
