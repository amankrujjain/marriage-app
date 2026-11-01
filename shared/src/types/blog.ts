import type { BlogPostStatus } from '../enums/BlogPostStatus';

/** List-card shape — no body. Dates are ISO strings. */
export interface PublicBlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  coverAlt: string;
  tags: string[];
  category: string;
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
}

export interface PublicBlogPost extends PublicBlogPostSummary {
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  noindex: boolean;
  keywords: string[];
}

/**
 * Exactly one of the two is non-null.
 * redirectTo is the current slug (not a path); the client builds /blog/<slug>/.
 */
export interface PublicBlogPostLookup {
  post: PublicBlogPost | null;
  redirectTo: string | null;
}

export interface BlogSitemapEntry {
  slug: string;
  lastModified: string;
}

/** Admin list-card shape. Dates are ISO strings. */
export interface AdminBlogPostSummary {
  id: string;
  title: string;
  slug: string;
  status: BlogPostStatus;
  publishAt: string | null;
  publishedAt: string | null;
  featured: boolean;
  noindex: boolean;
  category: string;
  tags: string[];
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBlogPost extends AdminBlogPostSummary {
  previousSlugs: string[];
  excerpt: string;
  contentHtml: string;
  contentJson: unknown;
  coverImageUrl: string | null;
  coverAlt: string;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
  keywords: string[];
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
}

export interface CreateBlogPostPayload {
  title: string;
  slug?: string;
  excerpt?: string;
  contentHtml?: string;
  contentJson?: unknown;
  coverImageUrl?: string | null;
  coverAlt?: string;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  noindex?: boolean;
  featured?: boolean;
  tags?: string[];
  category?: string;
  keywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
}

export type UpdateBlogPostPayload = Partial<CreateBlogPostPayload>;

export interface ScheduleBlogPostPayload {
  publishAt: string;
}
