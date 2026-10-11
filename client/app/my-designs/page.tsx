'use client';

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { MyDesignsPanel } from '@/features/biodata/components/MyDesignsPanel';

export default function MyDesignsPage() {
  return (
    <ProtectedRoute>
      <MyDesignsPanel />
    </ProtectedRoute>
  );
}
