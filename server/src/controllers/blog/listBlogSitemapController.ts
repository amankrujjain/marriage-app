import type { NextFunction, Request, Response } from 'express';
import { listBlogSitemapService } from '../../services/blog/listBlogSitemapService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function listBlogSitemapController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    sendSuccess(
      res,
      await listBlogSitemapService(),
      'Blog sitemap fetched successfully',
    );
  } catch (error) {
    next(error);
  }
}
