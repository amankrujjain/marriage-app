import type { NextFunction, Request, Response } from 'express';
import { publishDueScheduledBlogPosts } from '../../services/cron/publishScheduledBlogService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function publishScheduledBlogController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await publishDueScheduledBlogPosts();
    sendSuccess(res, result, 'Scheduled blog publish completed');
  } catch (error) {
    next(error);
  }
}
