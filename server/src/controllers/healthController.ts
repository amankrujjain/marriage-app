import type { Request, Response, NextFunction } from 'express';
import { getHealthStatus } from '../services/healthService';
import { sendSuccess } from '../utils/sendSuccess';

export function getHealth(req: Request, res: Response, next: NextFunction): void {
  try {
    const deep = Boolean(req.query.deep);
    const data = getHealthStatus(deep);
    sendSuccess(res, data, 'Health check successful');
  } catch (error) {
    next(error);
  }
}
