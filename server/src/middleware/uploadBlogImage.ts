import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { BadRequestError } from '../errors/BadRequestError';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    // First pass on declared MIME; magic bytes are verified in the service.
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    if (!ok) {
      cb(
        new BadRequestError(
          'Only JPEG, PNG, or WebP allowed',
          'BLOG_IMAGE_TYPE_INVALID',
        ),
      );
      return;
    }
    cb(null, true);
  },
});

const single = upload.single('image');

export function uploadBlogImageMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  single(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      next(new BadRequestError('Image must be under 5MB', 'BLOG_IMAGE_TOO_LARGE'));
      return;
    }
    next(err);
  });
}
