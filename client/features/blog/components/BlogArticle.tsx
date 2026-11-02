import Link from 'next/link';
import type { PublicBlogPost, PublicBlogPostSummary } from '@marriage/shared';
import { prepareBlogContentWithToc } from '../prepareBlogContent';
import { BlogPostCard } from './BlogPostCard';

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

type BlogArticleProps = {
  post: PublicBlogPost;
  related: PublicBlogPostSummary[];
};

export function BlogArticle({ post, related }: BlogArticleProps) {
  const { html, toc } = prepareBlogContentWithToc(post.contentHtml || '');
  const cover = post.ogImageUrl || post.coverImageUrl;

  return (
    <div className="blog-article-layout">
      <article className="blog-article">
        <nav className="blog-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog/">Blog</Link>
          <span>/</span>
          <span>{post.title}</span>
        </nav>

        <header className="blog-article-head">
          <p className="blog-kicker">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            {post.authorName ? ` · ${post.authorName}` : null}
          </p>
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="blog-article-lede">{post.excerpt}</p> : null}
          {post.tags.length > 0 ? (
            <ul className="blog-card-tags">
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}
        </header>

        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="blog-article-cover"
            src={cover}
            alt={post.coverAlt || post.title}
          />
        ) : null}

        <div
          className="blog-article-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      {toc.length > 0 ? (
        <aside className="blog-toc" aria-label="On this page">
          <p className="blog-toc-title">On this page</p>
          <ol>
            {toc.map((item) => (
              <li key={item.id} data-level={item.level}>
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            ))}
          </ol>
        </aside>
      ) : null}

      {related.length > 0 ? (
        <section className="blog-related">
          <h2>Related articles</h2>
          <div className="blog-grid">
            {related.map((item) => (
              <BlogPostCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
