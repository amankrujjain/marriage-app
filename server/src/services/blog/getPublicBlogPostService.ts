import type { PublicBlogPostLookup } from '@marriage/shared';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  findPublishedBlogPostByPreviousSlug,
  findPublishedBlogPostBySlug,
} from '../../repositories/blogPostRepository';
import { toPublicBlogPost } from '../../utils/toPublicBlogPost';

export async function getPublicBlogPostService(
  slug: string,
): Promise<PublicBlogPostLookup> {
  const doc = await findPublishedBlogPostBySlug(slug);
  if (doc) {
    return { post: toPublicBlogPost(doc), redirectTo: null };
  }

  const found = await findPublishedBlogPostByPreviousSlug(slug);
  if (found && found.slug !== slug) {
    return { post: null, redirectTo: found.slug };
  }

  throw new NotFoundError('Blog post not found', 'BLOG_POST_NOT_FOUND');
}
