import type { Metadata } from 'next';
import { Providers } from './providers';
import { SITE_URL } from '@/lib/seo';
import './globals.css';
import './nav-ui.css';
import '@/styles/vp-templates/index.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Free Marriage Biodata Maker | MarriageBio',
    template: '%s | MarriageBio',
  },
  description:
    'Create a print-ready Indian marriage biodata online. Free A4 designs, live preview, PDF and WhatsApp download.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  themeColor: '#681421',
  openGraph: {
    type: 'website',
    siteName: 'MarriageBio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MarriageBio — Free marriage biodata maker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
};

/**
 * Fonts load via stylesheet link (not next/font/google).
 * next/font/google fails intermittently in Docker when Google returns
 * extensionless /l/font?kit= URLs (Next 15.x loader bug).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Marcellus&family=Mulish:wght@400;500;600;700;800&family=Tiro+Devanagari+Hindi&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
