'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { clearLegacyAccessToken } from '@/lib/tokenStorage';
import { fetchMe, refreshSessionRequest } from '../services/authApi';
import { authAnonymous, authLoading, authSuccess } from '../store/authSlice';

export function useAuthBootstrap(): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let active = true;
    clearLegacyAccessToken();

    async function bootstrap(): Promise<void> {
      dispatch(authLoading());
      try {
        const user = await fetchMe();
        if (active) dispatch(authSuccess(user));
        return;
      } catch {
        /* try refresh cookie */
      }

      try {
        const session = await refreshSessionRequest();
        if (active) dispatch(authSuccess(session.user));
      } catch {
        if (active) dispatch(authAnonymous());
      }
    }

    void bootstrap();
    return () => {
      active = false;
    };
  }, [dispatch]);
}
