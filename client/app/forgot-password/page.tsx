'use client';

import { GuestOnlyRoute } from '@/features/auth/components/GuestOnlyRoute';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <GuestOnlyRoute>
      <AuthShell
        title="Forgot password"
        subtitle="Enter the email on your account. We will send a reset link when email is connected."
      >
        <ForgotPasswordForm />
      </AuthShell>
    </GuestOnlyRoute>
  );
}
