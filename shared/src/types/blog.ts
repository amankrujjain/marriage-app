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
