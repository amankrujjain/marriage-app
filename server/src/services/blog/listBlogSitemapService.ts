import type { BlogSitemapEntry } from '@marriage/shared';
import { listPublishedBlogSitemap } from '../../repositories/blogPostRepository';

export async function listBlogSitemapService(): Promise<BlogSitemapEntry[]> {
  const docs = await listPublishedBlogSitemap();
  return docs.map((doc) => ({
    slug: doc.slug,
    lastModified: (doc.updatedAt ?? doc.publishedAt!).toISOString(),
  }));
}
