import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { BadRequestError } from '../errors/BadRequestError';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ok = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
    ].includes(file.mimetype);
    if (!ok) {
      cb(
        new BadRequestError(
          'Only JPEG, PNG, WebP, or SVG allowed',
          'ASSET_TYPE_INVALID',
        ),
      );
      return;
    }
    cb(null, true);
  },
});

const single = upload.single('file');

export function uploadAdminAssetMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  single(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      next(new BadRequestError('Asset must be under 5MB', 'ASSET_TOO_LARGE'));
      return;
    }
    next(err);
  });
}
