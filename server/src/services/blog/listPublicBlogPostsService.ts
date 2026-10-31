import type { PublicBlogPostSummary } from '@marriage/shared';
import { listPublishedBlogPosts } from '../../repositories/blogPostRepository';
import { toPublicBlogPostSummary } from '../../utils/toPublicBlogPost';

export async function listPublicBlogPostsService(
  page: number,
  limit: number,
  excludeSlug?: string,
): Promise<{ items: PublicBlogPostSummary[]; total: number }> {
  const { items, total } = await listPublishedBlogPosts(page, limit, excludeSlug);
  return { items: items.map(toPublicBlogPostSummary), total };
}
