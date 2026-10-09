'use client';

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AccountPanel } from '@/features/auth/components/AccountPanel';

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountPanel />
    </ProtectedRoute>
  );
}
