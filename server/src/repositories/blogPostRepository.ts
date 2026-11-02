import { BlogPostStatus } from '@marriage/shared';
import {
  BlogPostModel,
  type BlogPostDocument,
  type BlogPostFields,
} from '../models/BlogPost';


function publicBlogFilter(now = new Date()) {
  return {
    status: BlogPostStatus.PUBLISHED,
    publishedAt: { $ne: null, $lte: now },
    deletedAt: null,
  };
}

export async function listPublishedBlogPosts(
  page: number,
  limit: number,
  excludeSlug?: string,
): Promise<{ items: BlogPostDocument[]; total: number }> {
  const filter: Record<string, unknown> = { ...publicBlogFilter() };
  if (excludeSlug) {
    filter.slug = { $ne: excludeSlug };
  }

  const [items, total] = await Promise.all([
    BlogPostModel.find(filter)
      .select('-contentHtml -contentJson')
      .sort({ publishedAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    BlogPostModel.countDocuments(filter),
  ]);

  return { items, total };
}

export async function findPublishedBlogPostBySlug(
  slug: string,
): Promise<BlogPostDocument | null> {
  return BlogPostModel.findOne({ ...publicBlogFilter(), slug }).select(
    '-contentJson',
  );
}

export async function findPublishedBlogPostByPreviousSlug(
  slug: string,
): Promise<BlogPostDocument | null> {
  return BlogPostModel.findOne({
    ...publicBlogFilter(),
    previousSlugs: slug,
  })
    .select('slug')
    .sort({ publishedAt: -1 });
}

export async function listPublishedBlogSitemap(): Promise<BlogPostDocument[]> {
  return BlogPostModel.find({
    ...publicBlogFilter(),
    noindex: { $ne: true },
  })
    .select('slug publishedAt updatedAt')
    .sort({ publishedAt: -1 });
}

export async function listAdminBlogPosts(input: {
  page: number;
  limit: number;
  status?: BlogPostStatus;
  search?: string;
}): Promise<{ items: BlogPostDocument[]; total: number }> {
  const filter: Record<string, unknown> = { deletedAt: null };
  if (input.status) {
    filter.status = input.status;
  }
  if (input.search) {
    const escaped = input.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { title: { $regex: escaped, $options: 'i' } },
      { slug: { $regex: escaped, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    BlogPostModel.find(filter)
      .select('-contentHtml -contentJson')
      .sort({ updatedAt: -1, _id: -1 })
      .skip((input.page - 1) * input.limit)
      .limit(input.limit),
    BlogPostModel.countDocuments(filter),
  ]);

  return { items, total };
}

export async function findBlogPostById(
  id: string,
): Promise<BlogPostDocument | null> {
  return BlogPostModel.findOne({ _id: id, deletedAt: null });
}

export async function isBlogSlugTaken(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const filter: Record<string, unknown> = { slug };
  if (excludeId) {
    filter._id = { $ne: excludeId };
  }
  const found = await BlogPostModel.exists(filter);
  return Boolean(found);
}

export async function createBlogPost(
  input: Partial<BlogPostFields>,
): Promise<BlogPostDocument> {
  return BlogPostModel.create(input);
}

export async function updateBlogPostById(
  id: string,
  set: Partial<BlogPostFields>,
): Promise<BlogPostDocument | null> {
  return BlogPostModel.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { $set: set },
    { new: true, runValidators: true },
  );
}

export async function pullPreviousSlugFromOtherPosts(
  slug: string,
  excludeId?: string,
): Promise<void> {
  const filter: Record<string, unknown> = { previousSlugs: slug };
  if (excludeId) {
    filter._id = { $ne: excludeId };
  }
  await BlogPostModel.updateMany(filter, { $pull: { previousSlugs: slug } });
}

/** Due scheduled posts (candidate list before atomic claim). */
export async function listDueScheduledBlogPosts(
  now = new Date(),
  limit = 50,
): Promise<BlogPostDocument[]> {
  return BlogPostModel.find({
    status: BlogPostStatus.SCHEDULED,
    deletedAt: null,
    publishAt: { $ne: null, $lte: now },
  })
    .select('_id slug publishAt')
    .sort({ publishAt: 1 })
    .limit(limit);
}

/**
 * Atomically claim a scheduled post for publish.
 * Only one instance wins when status is still `scheduled`.
 */
export async function claimScheduledBlogPost(
  id: string,
  publishAt: Date,
): Promise<BlogPostDocument | null> {
  return BlogPostModel.findOneAndUpdate(
    {
      _id: id,
      status: BlogPostStatus.SCHEDULED,
      deletedAt: null,
    },
    {
      $set: {
        status: BlogPostStatus.PUBLISHED,
        publishedAt: publishAt,
        publishAt: null,
      },
    },
    { new: true },
  );
}
