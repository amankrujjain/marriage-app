'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';
import { useAppSelector } from '@/store/hooks';

type SiteHeaderProps = {
  variant?: 'home' | 'gallery' | 'app' | 'editor' | 'pass' | 'minimal';
};

function initials(name?: string | null) {
  return (name || 'A')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function SiteHeader({ variant = 'home' }: SiteHeaderProps) {
  const pathname = usePathname();
  const status = useAppSelector((state) => state.auth.status);
  const user = useAppSelector((state) => state.auth.user);
  const { logout } = useAuthActions();
  const isAuthed = status === 'authenticated';
  const isGallery = variant === 'gallery';
  const isAppShell = variant === 'app';
  const isPass = variant === 'pass';
  const isEditor = variant === 'editor';
  const isMinimal = variant === 'minimal';
  const brandHref = isAuthed ? '/account' : '/';
  const tagline = isEditor
    ? 'Biodata for a lifetime'
    : isPass
      ? 'Wedding Passes'
      : isMinimal
        ? 'Your Vivah, Your Story'
        : undefined;

  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNavOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setNavOpen(false);
      }
    }
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const howHref = pathname === '/' ? '#how' : '/#how';
  const pricingHref = pathname === '/' ? '#pricing' : '/#pricing';

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className={`site-head${isMinimal ? ' head-minimal' : ''}`}>
        <div className="wrap">
          <BrandLogo href={brandHref} tagline={tagline} />
          {isMinimal ? (
            <div className="head-links">
              <span>Having trouble?</span>{' '}
              <a href="mailto:support@example.com">Contact Support</a>
            </div>
          ) : (
            <>
          <button
            className="burger"
            type="button"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="nav"
            onClick={() => setNavOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <nav className={`nav${navOpen ? ' open' : ''}`} id="nav" aria-label="Main">
            {isPass ? (
              <>
                <Link href="/templates" className="nl">
                  Templates
                </Link>
                <Link href={pricingHref} className="nl">
                  Pricing
                </Link>
                <Link href={howHref} className="nl">
                  How it works
                </Link>
                {isAuthed ? (
                  <Link href="/account" className="btn btn-ghost btn-sm">
                    PROFILE
                  </Link>
                ) : (
                  <Link href="/login" className="btn btn-ghost btn-sm">
                    LOG IN
                  </Link>
                )}
              </>
            ) : isAuthed ? (
              <>
                <Link
                  href="/templates"
                  className="nl"
                  aria-current={pathname.startsWith('/templates') ? 'page' : undefined}
                >
                  Templates
                </Link>
                <Link
                  href="/my-designs"
                  className="nl"
                  aria-current={pathname.startsWith('/my-designs') ? 'page' : undefined}
                >
                  My Designs
                </Link>
                <Link
                  href="/account"
                  className="nl"
                  aria-current={pathname.startsWith('/account') ? 'page' : undefined}
                >
                  Profile
                </Link>
                <div className="menu-wrap" ref={menuRef}>
                  <button
                    className="avatar-btn"
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    aria-controls="avm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen((o) => !o);
                    }}
                  >
                    <span className="avatar">{initials(user?.name)}</span>
                    <span>{(user?.name || '').split(' ')[0]}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M2 4l4 4 4-4" />
                    </svg>
                  </button>
                  <div className={`menu${menuOpen ? ' open' : ''}`} id="avm" role="menu">
                    <Link role="menuitem" href="/marriage-biodata-maker">
                      Create biodata
                    </Link>
                    <Link role="menuitem" href="/my-designs">
                      My Designs
                    </Link>
                    <Link role="menuitem" href="/account">
                      Profile
                    </Link>
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        void logout();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : isAppShell || isEditor ? (
              <>
                <Link
                  href="/templates"
                  className="nl"
                  aria-current={pathname.startsWith('/templates') ? 'page' : undefined}
                >
                  Templates
                </Link>
                <Link href="/login" className="btn btn-ghost btn-sm">
                  Sign in
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/templates"
                  className="nl"
                  aria-current={isGallery || pathname.startsWith('/templates') ? 'page' : undefined}
                >
                  Templates
                </Link>
                <Link href={howHref} className="nl">
                  How it works
                </Link>
                <Link href={pricingHref} className="nl">
                  Pricing
                </Link>
                <Link
                  href="/login"
                  className="nl"
                  aria-current={pathname.startsWith('/login') ? 'page' : undefined}
                >
                  Sign in
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Sign up
                </Link>
              </>
            )}
          </nav>
            </>
          )}
        </div>
      </header>
    </>
  );
}
