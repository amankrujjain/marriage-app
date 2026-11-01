export const RESERVED_BLOG_SLUGS = [
  'sitemap',
  'rss',
  'feed',
  'page',
  'tag',
  'category',
  'admin',
] as const;

export function isReservedBlogSlug(slug: string): boolean {
  return (RESERVED_BLOG_SLUGS as readonly string[]).includes(slug);
}

export function slugifyBlogTitle(input: string): string {
  const normalized = input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  let slug = normalized
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (slug.length > 200) {
    slug = slug.slice(0, 200).replace(/-+$/g, '');
  }
  if (!slug) {
    return `post-${Date.now().toString(36)}`;
  }
  return slug;
}
