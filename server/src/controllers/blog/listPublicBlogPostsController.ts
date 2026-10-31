import type { NextFunction, Request, Response } from 'express';
import { listPublicBlogPostsService } from '../../services/blog/listPublicBlogPostsService';
import { sendPaginated } from '../../utils/sendPaginated';

export async function listPublicBlogPostsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 12);
    const excludeSlug =
      typeof req.query.excludeSlug === 'string'
        ? req.query.excludeSlug
        : undefined;
    const { items, total } = await listPublicBlogPostsService(
      page,
      limit,
      excludeSlug,
    );
    sendPaginated(
      res,
      items,
      { page, limit, total },
      'Blog posts fetched successfully',
    );
  } catch (error) {
    next(error);
  }
}
