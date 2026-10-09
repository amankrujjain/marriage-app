import { toJpeg, toPng } from 'html-to-image';
import { ExportFormat } from '@marriage/shared';

export async function capturePreview(
  element: HTMLElement,
  format: ExportFormat,
): Promise<string> {
  const options = {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  };

  if (format === ExportFormat.JPG) {
    return toJpeg(element, { ...options, quality: 0.92 });
  }

  return toPng(element, options);
}
