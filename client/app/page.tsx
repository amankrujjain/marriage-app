import { MotifBg } from '@/components/landing/MotifBg';
import { BrandMark } from '@/components/landing/BrandMark';
import { HeroCopy } from '@/components/landing/HeroCopy';
import { HeroCta } from '@/components/landing/HeroCta';

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <MotifBg />
      <section className="relative z-10 w-full max-w-xl">
        <BrandMark />
        <HeroCopy />
        <HeroCta />
      </section>
    </main>
  );
}
