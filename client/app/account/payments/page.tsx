'use client';

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { PaymentHistoryPanel } from '@/features/billing/components/PaymentHistoryPanel';

export default function AccountPaymentsPage() {
  return (
    <ProtectedRoute>
      <PaymentHistoryPanel />
    </ProtectedRoute>
  );
}
