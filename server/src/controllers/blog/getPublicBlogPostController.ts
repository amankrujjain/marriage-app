import type { NextFunction, Request, Response } from 'express';
import { getPublicBlogPostService } from '../../services/blog/getPublicBlogPostService';
import { sendSuccess } from '../../utils/sendSuccess';

export async function getPublicBlogPostController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await getPublicBlogPostService(req.params.slug as string);
    sendSuccess(
      res,
      data,
      data.redirectTo
        ? 'Blog post moved'
        : 'Blog post fetched successfully',
    );
  } catch (error) {
    next(error);
  }
}
