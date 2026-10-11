'use client';

import { useRouter } from 'next/navigation';
import { ExportFormat, LanguageCode } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ApiClientError } from '@/lib/apiClient';
import { useTranslateBiodata } from '@/features/translation/hooks/useTranslateBiodata';
import { capturePreview } from '../utils/capturePreview';
import { requestExport } from '../services/exportApi';
import {
  exportCapturing,
  exportFailed,
  exportSucceeded,
  exportTranslating,
  exportUploading,
} from '../store/exportSlice';

function waitForPreviewPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.setTimeout(resolve, 80);
      });
    });
  });
}

export function useExportBiodata() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { translate } = useTranslateBiodata();
  const authStatus = useAppSelector((state) => state.auth.status);
  const exportLanguage = useAppSelector((state) => state.language.exportLanguage);
  const fullName = useAppSelector(
    (state) => state.biodata.content.personal.fullName ?? 'Marriage Biodata',
  );

  async function exportAs(format: ExportFormat): Promise<void> {
    if (authStatus !== 'authenticated') {
      const next =
        typeof window !== 'undefined' ? window.location.pathname : '/download';
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    const node = document.querySelector<HTMLElement>('[data-biodata-preview]');
    if (!node) {
      dispatch(exportFailed('Preview not found. Open the download page first.'));
      return;
    }

    try {
      if (exportLanguage !== LanguageCode.EN) {
        dispatch(exportTranslating());
      }

      const translated = await translate();
      if (!translated) {
        dispatch(
          exportFailed(
            'Could not translate biodata. Try English, or retry in a moment.',
          ),
        );
        return;
      }

      await waitForPreviewPaint();

      dispatch(exportCapturing());
      const imageBase64 = await capturePreview(node, format);
      dispatch(exportUploading());

      const personName =
        translated.personal.fullName?.trim() || fullName;

      const result = await requestExport({
        format,
        imageBase64,
        fileName: personName,
        personName,
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
      if (error instanceof ApiClientError && error.code === 'AUTH_REQUIRED') {
        const next =
          typeof window !== 'undefined' ? window.location.pathname : '/download';
        router.push(`/login?next=${encodeURIComponent(next)}`);
      }
    }
  }

  return { exportAs };
}
