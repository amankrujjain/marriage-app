import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { blogPostGraphJsonLd } from '@/features/blog/blogJsonLd';
import { BlogArticle } from '@/features/blog/components/BlogArticle';
import {
  BlogFetchError,
  getPublicBlogPost,
  isNotFound,
  listPublicBlogPosts,
} from '@/lib/blogApi';
import { INDEXABLE_ROBOTS, SITE_URL, absoluteUrl } from '@/lib/seo';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = `/blog/${slug}/`;

  try {
    const lookup = await getPublicBlogPost(slug);
    if (lookup.redirectTo) {
      return {
        alternates: { canonical: `/blog/${lookup.redirectTo}/` },
      };
    }
    const post = lookup.post;
    if (!post) {
      return { robots: { index: false, follow: false } };
    }

    const title = post.seoTitle || post.title;
    const description =
      post.seoDescription || post.excerpt || 'MarriageBio blog article';
    const canonicalPath = post.canonicalUrl
      ? undefined
      : `/blog/${post.slug}/`;
    const image = post.ogImageUrl || post.coverImageUrl;

    return {
      title: { absolute: title },
      description,
      alternates: {
        canonical: post.canonicalUrl || canonicalPath,
        languages: {
          'en-IN': `/blog/${post.slug}/`,
          'x-default': `/blog/${post.slug}/`,
        },
      },
      robots: post.noindex
        ? { index: false, follow: true }
        : INDEXABLE_ROBOTS,
      openGraph: {
        type: 'article',
        url: post.canonicalUrl || absoluteUrl(`/blog/${post.slug}/`),
        title,
        description,
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        images: image
          ? [{ url: image, width: 1200, height: 630, alt: post.coverAlt || title }]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch (err) {
    if (isNotFound(err)) {
      return {
        title: 'Article not found',
        robots: { index: false, follow: false },
        alternates: { canonical: path },
      };
    }
    // API down — keep canonical, do not noindex
    return {
      title: 'MarriageBio Blog',
      alternates: { canonical: path },
      openGraph: { url: new URL(path, SITE_URL).href },
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  try {
    const lookup = await getPublicBlogPost(slug);
    if (lookup.redirectTo) {
      permanentRedirect(`/blog/${lookup.redirectTo}/`);
    }
    if (!lookup.post) {
      notFound();
    }

    const post = lookup.post;
    let related: Awaited<ReturnType<typeof listPublicBlogPosts>>['items'] = [];
    try {
      const list = await listPublicBlogPosts({
        page: 1,
        limit: 4,
        excludeSlug: post.slug,
      });
      related = list.items;
    } catch {
      related = [];
    }

    const jsonLd = blogPostGraphJsonLd(post);

    return (
      <div className="landing">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader variant="app" />
        <main id="main" className="blog-shell">
          <BlogArticle post={post} related={related} />
        </main>
        <SiteFooter />
      </div>
    );
  } catch (err) {
    if (isNotFound(err)) {
      notFound();
    }
    return (
      <div className="landing">
        <SiteHeader variant="app" />
        <main id="main" className="blog-shell">
          <div className="blog-unavailable">
            <h1>Temporarily unavailable</h1>
            <p>
              We couldn&apos;t load this article right now. Please refresh in a
              moment.
            </p>
            {err instanceof BlogFetchError ? (
              <p className="blog-kicker">Error loading article</p>
            ) : null}
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }
}
