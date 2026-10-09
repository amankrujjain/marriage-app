'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { clearAccessToken, getAccessToken } from '@/lib/tokenStorage';
import { fetchMe } from '../services/authApi';
import { authAnonymous, authLoading, authSuccess } from '../store/authSlice';

export function useAuthBootstrap(): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let active = true;

    async function bootstrap(): Promise<void> {
      const token = getAccessToken();
      if (!token) {
        dispatch(authAnonymous());
        return;
      }
      dispatch(authLoading());
      try {
        const user = await fetchMe();
        if (active) dispatch(authSuccess(user));
      } catch {
        clearAccessToken();
        if (active) dispatch(authAnonymous());
      }
    }

    void bootstrap();
    return () => {
      active = false;
    };
  }, [dispatch]);
}
