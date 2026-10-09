import { MotifBg } from '@/components/landing/MotifBg';
import Link from 'next/link';

export function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <MotifBg />
      <section className="relative z-10 w-full max-w-md">
        <Link href="/" className="font-display text-2xl text-maroon">
          Vivah Patra
        </Link>
        <div className="mt-2 h-px w-16 bg-gold" />
        <h1 className="mt-6 font-display text-3xl text-maroon">{title}</h1>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
