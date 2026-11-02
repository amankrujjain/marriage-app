import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { BlogList } from '@/features/blog/components/BlogList';
import { listPublicBlogPosts, BlogFetchError } from '@/lib/blogApi';
import { INDEXABLE_ROBOTS, SITE_URL, absoluteUrl } from '@/lib/seo';

type BlogPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const path = page <= 1 ? '/blog/' : `/blog/?page=${page}`;
  const canonical = new URL(path, SITE_URL).href;
  return {
    title: page <= 1 ? 'Blog' : `Blog — page ${page}`,
    description:
      'Guides and tips for marriage biodata, formats, and sharing with family on WhatsApp.',
    alternates: {
      canonical: path,
      languages: { 'en-IN': path, 'x-default': path },
    },
    robots: INDEXABLE_ROBOTS,
    openGraph: {
      url: canonical,
      title: page <= 1 ? 'MarriageBio Blog' : `MarriageBio Blog — page ${page}`,
      description:
        'Guides and tips for marriage biodata, formats, and sharing with family.',
    },
  };
}

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);

  let items: Awaited<ReturnType<typeof listPublicBlogPosts>>['items'] = [];
  let totalPages = 1;
  let unavailable = false;

  try {
    const result = await listPublicBlogPosts({ page, limit: 9 });
    items = result.items;
    totalPages = result.meta.totalPages;
    if (page > totalPages) {
      notFound();
    }
  } catch (err) {
    if (err instanceof BlogFetchError && err.status === 404) {
      notFound();
    }
    unavailable = true;
  }

  return (
    <div className="landing">
      <SiteHeader variant="app" />
      <main id="main" className="blog-shell">
        <header className="blog-hero">
          <p className="blog-kicker">MarriageBio</p>
          <h1>Blog</h1>
          <p>
            Practical guides for marriage biodata — formats, wording, and sharing
            with family.
          </p>
        </header>

        {unavailable ? (
          <p className="blog-empty">
            The blog is temporarily unavailable. Please try again shortly.
          </p>
        ) : (
          <BlogList items={items} page={page} totalPages={totalPages} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
