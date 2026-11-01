import fs from 'fs';
import path from 'path';
import type { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../../errors/NotFoundError';

export function serveBlogImageController(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const fileName = String(req.params.fileName);
    if (!/^[0-9a-f-]{36}\.webp$/.test(fileName)) {
      throw new NotFoundError('Media not found', 'MEDIA_NOT_FOUND');
    }

    const root = path.resolve(process.cwd(), 'uploads', 'blog');
    const filePath = path.join(root, fileName);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      throw new NotFoundError('Media not found', 'MEDIA_NOT_FOUND');
    }

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    next(error);
  }
}
