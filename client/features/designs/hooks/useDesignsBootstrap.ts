'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { fetchPublicDesigns } from '../services/designsApi';
import { designsFailed, designsLoading, designsReady } from '../store/designsSlice';

export function useDesignsBootstrap(): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let active = true;
    dispatch(designsLoading());
    void fetchPublicDesigns()
      .then((items) => {
        if (active) dispatch(designsReady(items));
      })
      .catch((err) => {
        if (active) {
          dispatch(
            designsFailed(err instanceof Error ? err.message : 'Failed to load designs'),
          );
        }
      });
    return () => {
      active = false;
    };
  }, [dispatch]);
}
