import Link from 'next/link';

export function HeroCta() {
  return (
    <div className="animate-rise-delay-2 mt-10 flex flex-col items-center gap-3">
      <Link
        href="/marriage-biodata-maker"
        className="inline-flex min-h-12 min-w-[220px] items-center justify-center bg-maroon px-8 py-3 font-body text-base font-medium text-ivory transition-colors duration-300 hover:bg-[var(--color-maroon-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Create Marriage Biodata
      </Link>
      <span className="font-body text-sm text-ink/60">
        Beautiful biodata in minutes — ₹151 Wedding Pass
      </span>
      <Link
        href="/login"
        className="font-body text-sm text-maroon underline decoration-gold underline-offset-4"
      >
        Sign in
      </Link>
    </div>
  );
}
