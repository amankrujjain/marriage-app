import type { Metadata } from 'next';
import { Marcellus, Mukta, Tiro_Devanagari_Hindi } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const display = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const body = Mukta({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const hindi = Tiro_Devanagari_Hindi({
  subsets: ['devanagari', 'latin'],
  weight: '400',
  variable: '--font-hindi',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vivah Patra — Marriage biodata maker',
  description:
    'Fill in your details once, try them on every design, and download a print-ready A4 PDF plus a WhatsApp-sized image.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hindi.variable}`}>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
