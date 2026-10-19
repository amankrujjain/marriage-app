'use client';

import { AdminOnlyRoute } from '@/features/admin/components/AdminOnlyRoute';
import { AdminShell } from '@/features/admin/components/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminOnlyRoute>
      <AdminShell>{children}</AdminShell>
    </AdminOnlyRoute>
  );
}
