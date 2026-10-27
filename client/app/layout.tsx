import type { Metadata } from 'next';
import {
  Cormorant_Garamond,
  Marcellus,
  Mulish,
  Tiro_Devanagari_Hindi,
} from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
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
  title: 'MarriageBio — Marriage biodata maker',
  description:
    'Fill in your details once, try them on every design, and download a print-ready A4 PDF plus a WhatsApp-sized image.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${label.variable} ${hindi.variable}`}
    >
      <head>
        {/* ui-v2 template fonts — urls resolve under /vp/fonts/ */}
        <link rel="stylesheet" href="/vp/fonts.css" />
      </head>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
