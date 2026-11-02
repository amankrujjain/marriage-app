import Link from 'next/link';
import type { PublicBlogPostSummary } from '@marriage/shared';
import { BlogPostCard } from './BlogPostCard';

type BlogListProps = {
  items: PublicBlogPostSummary[];
  page: number;
  totalPages: number;
};

export function BlogList({ items, page, totalPages }: BlogListProps) {
  const featured = items.filter((p) => p.featured);
  const rest = items.filter((p) => !p.featured);
  const ordered = featured.length > 0 ? [...featured, ...rest] : items;

  return (
    <div className="blog-list">
      {ordered.length === 0 ? (
        <p className="blog-empty">No articles published yet. Check back soon.</p>
      ) : (
        <div className="blog-grid">
          {ordered.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="blog-pager" aria-label="Blog pages">
          {page > 1 ? (
            <Link
              href={page === 2 ? '/blog/' : `/blog/?page=${page - 1}`}
              rel="prev"
              className="btn btn-ghost btn-sm"
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="blog-pager-status">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/blog/?page=${page + 1}`}
              rel="next"
              className="btn btn-ghost btn-sm"
            >
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}
