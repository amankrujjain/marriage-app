'use client';

import { useAppSelector } from '@/store/hooks';

export function AppLoader() {
  const loading = useAppSelector((state) => state.ui.globalLoading);
  const message = useAppSelector((state) => state.ui.globalLoadingMessage);
  if (!loading) return null;

  return (
    <div className="app-loader" role="status" aria-live="polite" aria-busy="true">
      <div className="app-loader-card">
        <div className="app-loader-spin" aria-hidden />
        <p>{message || 'Please wait…'}</p>
      </div>
    </div>
  );
}
