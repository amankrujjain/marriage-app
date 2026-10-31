import { BlogPostStatus } from '@marriage/shared';
import { BlogPostModel, type BlogPostDocument } from '../models/BlogPost';

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
