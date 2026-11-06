import type { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../../errors/BadRequestError';
import { ForbiddenError } from '../../errors/ForbiddenError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { UserRole } from '@marriage/shared';
import { createStorageProvider } from '../../providers/storage/createStorageProvider';
import { parseProfilePhotoKey } from '../../utils/profilePhotoUrlRule';
import { env } from '../../config/env';

const OWNER_RE = /(?:^|\/)users\/([0-9a-f]{24})\/photos\//;

/**
 * Same-origin proxy for private R2 profile photos so html-to-image can
 * embed them without relying on R2 bucket CORS.
 */
export async function proxyProfilePhotoController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();

    const src = typeof req.query.src === 'string' ? req.query.src.trim() : '';
    if (!src) {
      throw new BadRequestError('Image src required', 'PHOTO_SRC_REQUIRED');
    }

    const key = parseProfilePhotoKey(src);
    if (!key) {
      throw new BadRequestError('Unsupported photo URL', 'PHOTO_URL_INVALID');
    }

    const owner = OWNER_RE.exec(key)?.[1];
    if (!owner) {
      throw new BadRequestError('Unsupported photo URL', 'PHOTO_URL_INVALID');
    }
    if (owner !== req.user.id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenError('Not allowed to access this photo');
    }

    const { buffer, mimeType } = await createStorageProvider().getObject(
      key,
      'private',
    );

    res.setHeader('Content-Type', mimeType || 'image/webp');
    res.setHeader('Content-Length', String(buffer.length));
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', env.CLIENT_URL);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(200).send(buffer);
  } catch (error) {
    next(error);
  }
}
