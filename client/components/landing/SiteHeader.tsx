import Link from 'next/link';
import { BrandLogo } from './BrandLogo';

type SiteHeaderProps = {
  variant?: 'home' | 'gallery';
};

export function SiteHeader({ variant = 'home' }: SiteHeaderProps) {
  const isGallery = variant === 'gallery';

  return (
    <header className="site-header">
      <nav className="site-nav">
        <BrandLogo />
        <div className="site-nav-links">
          {isGallery ? (
            <>
              <Link href="/templates" className="site-nav-link is-active">
                Templates
              </Link>
              <Link href="/demo" className="site-nav-link">
                Demo
              </Link>
              <Link href="/#pricing" className="site-nav-link">
                Pricing
              </Link>
            </>
          ) : (
            <>
              <Link href="/templates" className="site-nav-link">
                Templates
              </Link>
              <Link href="/demo" className="site-nav-link">
                Demo
              </Link>
              <Link href="#how" className="site-nav-link">
                How it works
              </Link>
              <Link href="#pricing" className="site-nav-link">
                Pricing
              </Link>
              <Link href="#" className="site-nav-link" lang="hi">
                हिंदी
              </Link>
            </>
          )}
          <Link href="/marriage-biodata-maker" className="btn-primary">
            Create my biodata
          </Link>
        </div>
      </nav>
    </header>
  );
}
