import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy & cookies — MarriageBio',
  description: 'How MarriageBio uses essential and analytics cookies.',
};

export default function PrivacyPage() {
  return (
    <div className="landing">
      <SiteHeader variant="app" />
      <main id="main" className="wrap" style={{ padding: '48px 20px 72px', maxWidth: 720 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: 0 }}>
          Privacy &amp; cookies
        </h1>
        <p style={{ marginTop: 16, lineHeight: 1.6 }}>
          MarriageBio uses essential cookies to keep you signed in. These are required for the
          product to work and are not used for advertising.
        </p>
        <p style={{ marginTop: 12, lineHeight: 1.6 }}>
          If you accept analytics cookies, we load Google Analytics (GA4) to understand which
          features help families create biodata — for example when someone starts filling the form
          or downloads a file. We do not sell your personal data.
        </p>
        <p style={{ marginTop: 12, lineHeight: 1.6 }}>
          You can decline analytics cookies and still use MarriageBio. Change your choice anytime
          via Cookie settings in the footer.
        </p>
        <p style={{ marginTop: 24 }}>
          <Link href="/">← Back home</Link>
        </p>
      </main>
      <SiteFooter slim />
    </div>
  );
}
