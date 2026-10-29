import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Designs',
  robots: { index: false, follow: false },
};

export default function MyDesignsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
