'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from './BrandLogo';
import { useAppSelector } from '@/store/hooks';

type SiteHeaderProps = {
  variant?: 'home' | 'gallery' | 'app';
};

export function SiteHeader({ variant = 'home' }: SiteHeaderProps) {
  const pathname = usePathname();
  const status = useAppSelector((state) => state.auth.status);
  const isAuthed = status === 'authenticated';
  const isGallery = variant === 'gallery';
  const isAppShell = variant === 'app' || isAuthed;
  const onEditor = pathname.startsWith('/marriage-biodata-maker');
  const brandHref = isAuthed ? '/account' : '/';

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main">
        <BrandLogo href={brandHref} />
        <div className="site-nav-links">
          {isAuthed ? (
            <>
              <Link
                href="/templates"
                className={`site-nav-link${pathname.startsWith('/templates') ? ' is-active' : ''}`}
              >
                Templates
              </Link>
              <Link
                href="/my-designs"
                className={`site-nav-link${pathname.startsWith('/my-designs') ? ' is-active' : ''}`}
              >
                My Designs
              </Link>
              <Link
                href="/account"
                className={`site-nav-link${pathname.startsWith('/account') ? ' is-active' : ''}`}
              >
                Profile
              </Link>
              {!onEditor ? (
                <Link href="/marriage-biodata-maker" className="btn-primary">
                  Create my biodata
                </Link>
              ) : null}
            </>
          ) : isAppShell ? (
            <>
              <Link
                href="/templates"
                className={`site-nav-link${pathname.startsWith('/templates') ? ' is-active' : ''}`}
              >
                Templates
              </Link>
              <Link href="/login" className="site-nav-link">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary">
                Sign up
              </Link>
            </>
          ) : isGallery ? (
            <>
              <Link href="/templates" className="site-nav-link is-active">
                Templates
              </Link>
              <Link href="/#pricing" className="site-nav-link">
                Pricing
              </Link>
              <Link href="/login" className="site-nav-link">
                Sign in
              </Link>
              <Link href="/register" className="site-nav-link">
                Sign up
              </Link>
              <Link href="/marriage-biodata-maker" className="btn-primary">
                Create my biodata
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="site-nav-link is-active">
                Home
              </Link>
              <Link href="/templates" className="site-nav-link">
                Templates
              </Link>
              <Link href="#how" className="site-nav-link">
                How it works
              </Link>
              <Link href="#pricing" className="site-nav-link">
                Pricing
              </Link>
              <Link href="/login" className="site-nav-link">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
