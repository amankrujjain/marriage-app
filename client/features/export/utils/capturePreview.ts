import { toJpeg, toPng } from 'html-to-image';
import { ExportFormat } from '@marriage/shared';
import { inlineImagesForCapture } from './inlineImagesForCapture';

function captureErrorMessage(error: unknown): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Export failed';
  if (/taint|insecure|SecurityError|cross-origin|CORS/i.test(raw)) {
    return 'Could not capture preview (photo blocked by browser security). Try again.';
  }
  return raw || 'Export failed';
}

export async function capturePreview(
  element: HTMLElement,
  format: ExportFormat,
): Promise<string> {
  const restore = await inlineImagesForCapture(element);

  // Presigned R2 URLs must not get extra query params (cacheBust would break SigV4).
  const options = {
    cacheBust: false,
    fetchRequestInit: { cache: 'no-store' as RequestCache },
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  };

  try {
    if (format === ExportFormat.JPG) {
      return await toJpeg(element, { ...options, quality: 0.92 });
    }
    return await toPng(element, options);
  } catch (error) {
    throw new Error(captureErrorMessage(error));
  } finally {
    restore();
  }
}
