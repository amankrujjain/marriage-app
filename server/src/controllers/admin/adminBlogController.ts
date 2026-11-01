import type { NextFunction, Request, Response } from 'express';
import { BlogPostStatus } from '@marriage/shared';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import {
  createAdminBlogPostService,
  deleteAdminBlogPostService,
  getAdminBlogPostService,
  listAdminBlogPostsService,
  publishAdminBlogPostService,
  scheduleAdminBlogPostService,
  unpublishAdminBlogPostService,
  updateAdminBlogPostService,
} from '../../services/admin/adminBlogService';
import { sendCreated } from '../../utils/sendCreated';
import { sendPaginated } from '../../utils/sendPaginated';
import { sendSuccess } from '../../utils/sendSuccess';

export async function adminListBlogPostsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 25);
    const status =
      typeof req.query.status === 'string'
        ? (req.query.status as BlogPostStatus)
        : undefined;
    const search =
      typeof req.query.search === 'string' ? req.query.search : undefined;
    const { items, total } = await listAdminBlogPostsService({
      page,
      limit,
      status,
      search,
    });
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

export async function adminGetBlogPostController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const data = await getAdminBlogPostService(String(req.params.id));
    sendSuccess(res, data, 'Blog post fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function adminCreateBlogPostController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const data = await createAdminBlogPostService(req.user.id, req.body);
    sendCreated(res, data, 'Blog post created');
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateBlogPostController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const data = await updateAdminBlogPostService(
      req.user.id,
      String(req.params.id),
      req.body,
    );
    sendSuccess(res, data, 'Blog post updated');
  } catch (error) {
    next(error);
  }
}

export async function adminPublishBlogPostController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const data = await publishAdminBlogPostService(
      req.user.id,
      String(req.params.id),
    );
    sendSuccess(res, data, 'Blog post published');
  } catch (error) {
    next(error);
  }
}

export async function adminUnpublishBlogPostController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const data = await unpublishAdminBlogPostService(
      req.user.id,
      String(req.params.id),
    );
    sendSuccess(res, data, 'Blog post unpublished');
  } catch (error) {
    next(error);
  }
}

export async function adminScheduleBlogPostController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    const data = await scheduleAdminBlogPostService(
      req.user.id,
      String(req.params.id),
      new Date(req.body.publishAt),
    );
    sendSuccess(res, data, 'Blog post scheduled');
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteBlogPostController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError();
    await deleteAdminBlogPostService(req.user.id, String(req.params.id));
    sendSuccess(res, null, 'Blog post deleted');
  } catch (error) {
    next(error);
  }
}
