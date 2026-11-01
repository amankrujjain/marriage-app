import type { AdminBlogPost, AdminBlogPostSummary } from '@marriage/shared';
import type { BlogPostDocument } from '../models/BlogPost';

export function toAdminBlogPostSummary(
  doc: BlogPostDocument,
): AdminBlogPostSummary {
  return {
    id: doc._id.toString(),
    title: doc.title ?? '',
    slug: doc.slug ?? '',
    status: doc.status,
    publishAt: doc.publishAt ? doc.publishAt.toISOString() : null,
    publishedAt: doc.publishedAt ? doc.publishedAt.toISOString() : null,
    featured: Boolean(doc.featured),
    noindex: Boolean(doc.noindex),
    category: doc.category ?? '',
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    authorName: doc.authorName ?? '',
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function toAdminBlogPost(doc: BlogPostDocument): AdminBlogPost {
  return {
    ...toAdminBlogPostSummary(doc),
    previousSlugs: Array.isArray(doc.previousSlugs) ? doc.previousSlugs : [],
    excerpt: doc.excerpt ?? '',
    contentHtml: doc.contentHtml ?? '',
    contentJson: doc.contentJson ?? null,
    coverImageUrl: doc.coverImageUrl ?? null,
    coverAlt: doc.coverAlt ?? '',
    ogImageUrl: doc.ogImageUrl ?? null,
    canonicalUrl: doc.canonicalUrl ?? null,
    keywords: Array.isArray(doc.keywords) ? doc.keywords : [],
    seoTitle: doc.seoTitle ?? '',
    seoDescription: doc.seoDescription ?? '',
    focusKeyword: doc.focusKeyword ?? '',
  };
}
