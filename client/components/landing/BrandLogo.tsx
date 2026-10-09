import Link from 'next/link';

function LotusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F2C14E" strokeWidth="1.6">
      <path d="M12 3c-3 4-3 9 0 13c3-4 3-9 0-13z" />
      <path d="M12 16c-4-1-7-4-8-9c4 .5 7 3 8 6" />
      <path d="M12 16c4-1 7-4 8-9c-4 .5-7 3-8 6" />
      <path d="M5 20h14" />
    </svg>
  );
}

export function BrandLogo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="site-logo">
      <span className="site-logo-mark">
        <LotusIcon />
      </span>
      <span className="site-logo-text">Vivah Patra</span>
    </Link>
  );
}
