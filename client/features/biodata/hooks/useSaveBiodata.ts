'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ApiClientError } from '@/lib/apiClient';
import { createBiodata, updateBiodata } from '../services/biodataApi';
import { saveFailed, saveStarted, saveSucceeded } from '../store/biodataSlice';

export function useSaveBiodata() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authStatus = useAppSelector((state) => state.auth.status);
  const { biodataId, title, content } = useAppSelector((state) => state.biodata);

  async function save(): Promise<void> {
    if (authStatus !== 'authenticated') {
      router.push('/login?next=/marriage-biodata-maker');
      return;
    }
    dispatch(saveStarted());
    try {
      const payload = { title: title || undefined, content };
      const record = biodataId
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
