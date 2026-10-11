'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ApiClientError } from '@/lib/apiClient';
import { createBiodata, updateBiodata } from '../services/biodataApi';
import { saveFailed, saveStarted, saveSucceeded } from '../store/biodataSlice';

export function useSaveBiodata() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.auth.status);
  const { biodataId, title, content } = useAppSelector((state) => state.biodata);

  async function save(): Promise<void> {
    // Guests keep the draft in the browser; cloud save only after login
    if (authStatus !== 'authenticated') {
      dispatch(saveSucceeded({ id: biodataId ?? 'local-draft', title: title || 'Draft' }));
      return;
    }
    dispatch(saveStarted());
    try {
      const payload = { title: title || undefined, content };
      const record = biodataId && biodataId !== 'local-draft'
        ? await updateBiodata(biodataId, payload)
        : await createBiodata(payload);
      dispatch(saveSucceeded({ id: record.id, title: record.title }));
    } catch (error) {
      const message =
        error instanceof ApiClientError || error instanceof Error
          ? error.message
          : 'Could not save biodata';
      dispatch(saveFailed(message));
    }
  }

  return { save };
}
