import type { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';
import { flushOldLogFiles } from '../../services/cron/flushLogsService';
import { sendSuccess } from '../../utils/sendSuccess';
import { logger } from '../../utils/logger';

export async function flushLogsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = (req.body ?? {}) as { retentionDays?: number };
    const retentionDays =
      typeof body.retentionDays === 'number'
        ? body.retentionDays
        : env.LOG_RETENTION_DAYS;
    const result = await flushOldLogFiles(retentionDays);
    logger.info('cron.flush-logs.done', result);
    sendSuccess(res, result, 'Log flush completed');
  } catch (error) {
    next(error);
  }
}
