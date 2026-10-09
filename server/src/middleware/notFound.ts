import type { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/NotFoundError';

export function notFound(_req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError('Route not found', 'ROUTE_NOT_FOUND'));
}
