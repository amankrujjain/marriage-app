import { BadRequestError } from '../errors/BadRequestError';

export function parseImageBase64(imageBase64: string): Buffer {
  const trimmed = imageBase64.trim();
  const match = trimmed.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/i);
  const payload = match?.[2] ?? trimmed.replace(/^data:[^;]+;base64,/, '');

  if (!payload || payload.length < 32) {
    throw new BadRequestError('Invalid image payload', 'EXPORT_IMAGE_INVALID');
  }

  try {
    return Buffer.from(payload, 'base64');
  } catch {
    throw new BadRequestError('Invalid image encoding', 'EXPORT_IMAGE_INVALID');
  }
}
