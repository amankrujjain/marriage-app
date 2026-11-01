import { toJpeg, toPng } from 'html-to-image';
import { ExportFormat } from '@marriage/shared';

export async function capturePreview(
  element: HTMLElement,
  format: ExportFormat,
): Promise<string> {
  // Presigned R2 URLs must not get extra query params (cacheBust would break SigV4).
  const options = {
    cacheBust: false,
    fetchRequestInit: { cache: 'no-store' as RequestCache },
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  };

  if (format === ExportFormat.JPG) {
    return toJpeg(element, { ...options, quality: 0.92 });
  }

  return toPng(element, options);
}
