'use client';

import { useRouter } from 'next/navigation';
import { ExportFormat, LanguageCode } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ApiClientError } from '@/lib/apiClient';
import { slugFromTemplateId } from '@/features/biodata/components/editor/designMap';
import { useTranslateBiodata } from '@/features/translation/hooks/useTranslateBiodata';
import { capturePreview } from '../utils/capturePreview';
import { requestDocumentExport, requestExport } from '../services/exportApi';
import {
  exportCapturing,
  exportFailed,
  exportSucceeded,
  exportTranslating,
  exportUploading,
} from '../store/exportSlice';
import { globalLoadingHide, globalLoadingShow } from '@/store/slices/uiSlice';
import { trackDownload } from '@/lib/analytics';

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
  const designSlug = useAppSelector(
    (state) =>
      state.template.selectedDesignSlug ||
      slugFromTemplateId(state.template.selectedTemplateId),
  );
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
      dispatch(globalLoadingShow('Preparing your download…'));
      if (exportLanguage !== LanguageCode.EN) {
        dispatch(exportTranslating());
      }

      // Always continues: translate() falls back to English after retries.
      const translated = await translate();

      window.VP?.setLocale?.(exportLanguage);
      await waitForPreviewPaint();

      const personName =
        translated.personal.fullName?.trim() || fullName;

      // Prefer selectable text PDF; fall back to image PDF for non-Latin scripts.
      if (format === ExportFormat.PDF) {
        try {
          dispatch(exportUploading());
          const result = await requestDocumentExport({
            format: ExportFormat.PDF,
            content: translated,
            fileName: personName,
            personName,
            designSlug: designSlug || undefined,
          });
          dispatch(exportSucceeded(result));
          trackDownload(format);
          return;
        } catch (error) {
          if (
            !(error instanceof ApiClientError) ||
            error.code !== 'UNSUPPORTED_SCRIPT'
          ) {
            throw error;
          }
          // Fall through to image-based export (same watermark/pass rules).
        }
      }

      dispatch(exportCapturing());
      const imageBase64 = await capturePreview(node, format);
      dispatch(exportUploading());

      const result = await requestExport({
        format,
        imageBase64,
        fileName: personName,
        personName,
        designSlug: designSlug || undefined,
      });
      dispatch(exportSucceeded(result));
      trackDownload(format);
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
    } finally {
      dispatch(globalLoadingHide());
    }
  }

  return { exportAs };
}
