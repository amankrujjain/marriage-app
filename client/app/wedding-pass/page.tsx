import Link from 'next/link';
import { MotifBg } from '@/components/landing/MotifBg';
import { PREMIUM_AMOUNT_INR, PREMIUM_DURATION_DAYS } from '@marriage/shared';

export default function WeddingPassPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <MotifBg />
      <section className="relative z-10 w-full max-w-md text-center">
        <p className="font-display text-4xl text-maroon">Wedding Pass</p>
        <div className="mx-auto mt-3 h-px w-16 bg-gold" />
        <p className="mt-6 font-body text-lg text-ink/80">
          ₹{PREMIUM_AMOUNT_INR} for {PREMIUM_DURATION_DAYS} days of biodata exports,
          downloads, and WhatsApp sharing.
        </p>
        <p className="mt-4 font-body text-sm text-ink/60">
          Payment checkout arrives in the next phase. You can keep editing and previewing
          for free.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/marriage-biodata-maker"
            className="inline-flex min-h-12 items-center justify-center bg-maroon px-6 font-body text-ivory"
          >
            Back to biodata maker
          </Link>
          <Link
            href="/account"
            className="font-body text-maroon underline decoration-gold underline-offset-4"
          >
            View account
          </Link>
        </div>
      </section>
    </main>
  );
}
