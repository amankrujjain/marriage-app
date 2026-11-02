import Link from 'next/link';
import type { PublicBlogPostSummary } from '@marriage/shared';

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export function BlogPostCard({ post }: { post: PublicBlogPostSummary }) {
  return (
    <article className="blog-card">
      <Link href={`/blog/${post.slug}/`} className="blog-card-media">
        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImageUrl} alt={post.coverAlt || post.title} />
        ) : (
          <div className="blog-card-placeholder" aria-hidden />
        )}
      </Link>
      <div className="blog-card-body">
        <p className="blog-card-meta">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.featured ? <span className="blog-card-flag">Featured</span> : null}
        </p>
        <h2 className="blog-card-title">
          <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
        </h2>
        {post.excerpt ? <p className="blog-card-excerpt">{post.excerpt}</p> : null}
        {post.tags.length > 0 ? (
          <ul className="blog-card-tags">
            {post.tags.slice(0, 4).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
