import type { Metadata } from 'next';
import { breadcrumbJsonLd, languageAlternates } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Wedding Pass',
  description:
    'Unlock premium biodata downloads for 30 days with the MarriageBio Wedding Pass.',
  alternates: languageAlternates('/wedding-pass/'),
};

const crumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Wedding Pass', path: '/wedding-pass/' },
]);

export default function WeddingPassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      {children}
    </>
  );
}
