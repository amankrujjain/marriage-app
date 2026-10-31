import type {
  PublicBlogPost,
  PublicBlogPostSummary,
} from '@marriage/shared';
import type { BlogPostDocument } from '../models/BlogPost';

export function toPublicBlogPostSummary(
  doc: BlogPostDocument,
): PublicBlogPostSummary {
  return {
    id: doc._id.toString(),
    title: doc.title ?? '',
    slug: doc.slug ?? '',
    excerpt: doc.excerpt ?? '',
    coverImageUrl: doc.coverImageUrl ?? null,
    coverAlt: doc.coverAlt ?? '',
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    category: doc.category ?? '',
    featured: Boolean(doc.featured),
    publishedAt: (doc.publishedAt ?? doc.createdAt).toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    authorName: doc.authorName ?? '',
  };
}

export function toPublicBlogPost(doc: BlogPostDocument): PublicBlogPost {
  return {
    ...toPublicBlogPostSummary(doc),
    contentHtml: doc.contentHtml ?? '',
    seoTitle: doc.seoTitle ?? '',
    seoDescription: doc.seoDescription ?? '',
    focusKeyword: doc.focusKeyword ?? '',
    canonicalUrl: doc.canonicalUrl ?? null,
    ogImageUrl: doc.ogImageUrl ?? null,
    noindex: Boolean(doc.noindex),
    keywords: Array.isArray(doc.keywords) ? doc.keywords : [],
  };
}
