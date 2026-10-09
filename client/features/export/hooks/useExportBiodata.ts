'use client';

import { useRouter } from 'next/navigation';
import { ExportFormat } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ApiClientError } from '@/lib/apiClient';
import { capturePreview } from '../utils/capturePreview';
import { requestExport } from '../services/exportApi';
import {
  exportCapturing,
  exportFailed,
  exportSucceeded,
  exportUploading,
} from '../store/exportSlice';

export function useExportBiodata() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authStatus = useAppSelector((state) => state.auth.status);
  const fullName = useAppSelector(
    (state) => state.biodata.content.personal.fullName ?? 'Marriage Biodata',
  );

  async function exportAs(format: ExportFormat): Promise<void> {
    if (authStatus !== 'authenticated') {
      router.push('/login?next=/marriage-biodata-maker');
      return;
    }

    const node = document.querySelector<HTMLElement>('[data-biodata-preview]');
    if (!node) {
      dispatch(exportFailed('Preview not found. Open the preview step first.'));
      return;
    }

    try {
      dispatch(exportCapturing());
      const imageBase64 = await capturePreview(node, format);
      dispatch(exportUploading());
      const result = await requestExport({
        format,
        imageBase64,
        fileName: fullName,
        personName: fullName,
      });
      dispatch(exportSucceeded(result));
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Export failed';
      dispatch(exportFailed(message));
      if (error instanceof ApiClientError && error.code === 'PREMIUM_REQUIRED') {
        router.push('/wedding-pass');
      }
    }
  }

  return { exportAs };
}
