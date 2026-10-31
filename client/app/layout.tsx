import type { Metadata } from 'next';
import {
  Cormorant_Garamond,
  Marcellus,
  Mulish,
  Tiro_Devanagari_Hindi,
} from 'next/font/google';
import { Providers } from './providers';
import { SITE_URL } from '@/lib/seo';
import './globals.css';
import './nav-ui.css';
import '@/styles/vp-templates/index.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const body = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const label = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-label',
  display: 'swap',
});

const hindi = Tiro_Devanagari_Hindi({
  subsets: ['devanagari', 'latin'],
  weight: '400',
  variable: '--font-hindi',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Free Marriage Biodata Maker | MarriageBio',
    template: '%s | MarriageBio',
  },
  description:
    'Create a print-ready Indian marriage biodata online. Free A4 designs, live preview, PDF and WhatsApp download.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${label.variable} ${hindi.variable}`}
    >
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
