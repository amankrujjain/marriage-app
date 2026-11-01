import fs from 'fs';
import path from 'path';
import type { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';
import { NotFoundError } from '../../errors/NotFoundError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { verifyAccessToken } from '../../services/tokenService';
import { readAccessTokenFromRequest } from '../../utils/authCookies';
import {
  isSafeMediaFileName,
  type MediaKind,
  verifyMediaSignature,
} from '../../utils/signedMediaUrl';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.docx':
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function resolveDiskPath(fileName: string): string | null {
  const root = path.resolve(process.cwd(), 'uploads');
  const candidate = path.join(root, 'exports', fileName);
  const resolved = path.resolve(candidate);
  if (!resolved.startsWith(root + path.sep) && resolved !== root) return null;
  if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) return resolved;
  return null;
}

function hasValidAccess(req: Request, kind: MediaKind, fileName: string): boolean {
  if (
    verifyMediaSignature({
      kind,
      fileName,
      exp: typeof req.query.exp === 'string' ? req.query.exp : undefined,
      sig: typeof req.query.sig === 'string' ? req.query.sig : undefined,
    })
  ) {
    return true;
  }

  try {
    const token = readAccessTokenFromRequest(req);
    if (!token) return false;
    verifyAccessToken(token);
    return true;
  } catch {
    return false;
  }
}

export function serveMediaController(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const kind = req.params.kind as MediaKind;
    const fileName = req.params.fileName as string;

    if (kind !== 'exports') {
      throw new NotFoundError('Media not found', 'MEDIA_NOT_FOUND');
    }
    if (!isSafeMediaFileName(fileName)) {
      throw new NotFoundError('Media not found', 'MEDIA_NOT_FOUND');
    }
    if (!hasValidAccess(req, kind, fileName)) {
      throw new UnauthorizedError(
        'Authentication or signed URL required',
        'MEDIA_AUTH',
      );
    }

    const diskPath = resolveDiskPath(fileName);
    if (!diskPath) {
      throw new NotFoundError('Media not found', 'MEDIA_NOT_FOUND');
    }

    const ext = path.extname(fileName).toLowerCase();
    const mime = MIME[ext] ?? 'application/octet-stream';
    res.setHeader('Content-Type', mime);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', env.CLIENT_URL);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    const stream = fs.createReadStream(diskPath);
    stream.on('error', () => {
      next(new NotFoundError('Media not found', 'MEDIA_NOT_FOUND'));
    });
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
}
