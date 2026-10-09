import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span className="site-footer-brand">Vivah Patra</span>
        <div className="site-footer-links">
          <Link href="/marriage-biodata-maker">Hindu biodata</Link>
          <Link href="/marriage-biodata-maker">Muslim biodata</Link>
          <Link href="/marriage-biodata-maker">Hindi biodata</Link>
          <Link href="#">Privacy</Link>
          <Link href="#">Contact</Link>
        </div>
        <span className="site-footer-note">
          A document tool only. We don&apos;t do matchmaking or store your details.
        </span>
      </div>
    </footer>
  );
}
