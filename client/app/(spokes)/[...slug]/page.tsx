import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  pageBySegments,
  spokePages,
} from '@/content/spokes';
import { SpokePage } from '@/features/spokes/components/SpokePage';
import { publicFileExists } from '@/features/spokes/sampleImages';
import { absoluteUrl, INDEXABLE_ROBOTS, languageAlternates } from '@/lib/seo';

export const dynamicParams = false;

function ogLocale(language: 'en' | 'hi' | 'mr'): string {
  if (language === 'hi') return 'hi_IN';
  if (language === 'mr') return 'mr_IN';
  return 'en_IN';
}

export function generateStaticParams(): Array<{ slug: string[] }> {
  const pages =
    process.env.NODE_ENV === 'production'
      ? spokePages().filter((page) => page.published)
      : spokePages();

  for (const page of spokePages()) {
    if (!page.published) continue;
    for (const item of page.sampleDownloads) {
      if (!publicFileExists(item.href)) {
        // Allow publish before sample files are uploaded; broken links only.
        console.warn(
          `Published spoke ${page.id} links a missing download: ${item.href}`,
        );
      }
    }
  }

  return pages.map((page) => ({ slug: page.segments }));
}

type SpokeRouteProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: SpokeRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = pageBySegments(slug);
  if (!page || page.kind !== 'spoke') {
    return {};
  }

  // Published spokes are in the sitemap — must stay indexable.
  const robots = page.published
    ? INDEXABLE_ROBOTS
    : { index: false, follow: false };

  return {
    title: { absolute: page.title },
    description: page.metaDescription,
    alternates: languageAlternates(page.path),
    robots,
    openGraph: {
      url: absoluteUrl(page.path),
      title: page.title,
      description: page.metaDescription,
      locale: ogLocale(page.language),
    },
  };
}

export default async function SpokeCatchAllPage({ params }: SpokeRouteProps) {
  const { slug } = await params;
  const page = pageBySegments(slug);

  if (!page || page.kind !== 'spoke') {
    notFound();
  }

  // Production: unpublished spokes are omitted from generateStaticParams +
  // dynamicParams=false → 404. Dev still renders them (with noindex).
  if (process.env.NODE_ENV === 'production' && !page.published) {
    notFound();
  }

  return <SpokePage page={page} />;
}
