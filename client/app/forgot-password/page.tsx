'use client';

import { AuthShell } from '@/features/auth/components/AuthShell';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter the email on your account. We will send a reset link to that address."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
