import type { PublicBlogPost } from '@marriage/shared';
import {
  SITE_URL,
  absoluteUrl,
  breadcrumbJsonLd,
  organizationJsonLd,
} from '@/lib/seo';

export function blogPostingJsonLd(post: PublicBlogPost): Record<string, unknown> {
  const url = absoluteUrl(`/blog/${post.slug}/`);
  const image = post.ogImageUrl || post.coverImageUrl;
  return {
    '@type': 'BlogPosting',
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: url,
    url,
    image: image ? [image] : undefined,
    author: {
      '@type': 'Person',
      name: post.authorName || 'MarriageBio',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MarriageBio',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/favicon.ico'),
      },
    },
    keywords: post.keywords.length
      ? post.keywords.join(', ')
      : post.tags.join(', ') || undefined,
  };
}

export function blogPostGraphJsonLd(post: PublicBlogPost): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationJsonLd(),
      blogPostingJsonLd(post),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog/' },
        { name: post.title, path: `/blog/${post.slug}/` },
      ]),
    ],
  };
}

export function blogListJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'MarriageBio Blog',
    url: `${SITE_URL}/blog/`,
    publisher: organizationJsonLd(),
  };
}
