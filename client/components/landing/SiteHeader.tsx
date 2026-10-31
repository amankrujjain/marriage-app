'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { UserRole } from '@marriage/shared';
import { BrandLogo } from './BrandLogo';
import { HeaderAccountMenu } from './HeaderAccountMenu';
import { HeaderMegaMenu } from './HeaderMegaMenu';
import { MobileNavDrawer } from './MobileNavDrawer';
import { BurgerIcon, MegaChevron, pathMatches } from './navIcons';
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

function isFinePointer(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}

export function SiteHeader({ variant = 'home' }: SiteHeaderProps) {
  const pathname = usePathname();
  const status = useAppSelector((state) => state.auth.status);
  const user = useAppSelector((state) => state.auth.user);
  const { logout } = useAuthActions();
  const isAuthed = status === 'authenticated';
  const isAdmin = user?.role === UserRole.ADMIN;
  const isGallery = variant === 'gallery';
  const isEditor = variant === 'editor';
  const isMinimal = variant === 'minimal';
  const tagline = isEditor
    ? 'Biodata for a lifetime'
    : variant === 'pass'
      ? 'Wedding Pass'
      : isMinimal
        ? 'Your Vivah, Your Story'
        : undefined;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaTriggerRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMega = useCallback(() => setMegaOpen(false), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    setDrawerOpen(false);
    setMenuOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setMegaOpen(false);
        setDrawerOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const clearHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const scheduleMega = (open: boolean, delay: number) => {
    clearHover();
    hoverTimer.current = setTimeout(() => setMegaOpen(open), delay);
  };

  const howHref = pathname === '/' ? '#how' : '/#how';
  const pricingHref = pathname === '/' ? '#pricing' : '/#pricing';
  const userInitials = initials(user?.name);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className={`site-head${isMinimal ? ' head-minimal' : ''}`}>
        <div className="wrap">
          <BrandLogo href="/" tagline={tagline} />
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
                aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={drawerOpen}
                aria-controls="drawer"
                onClick={() => setDrawerOpen((o) => !o)}
              >
                <BurgerIcon />
              </button>
              <nav className="nav" aria-label="Main">
                <Link
                  href="/templates/"
                  className="nl"
                  aria-current={
                    isGallery || pathMatches(pathname, '/templates')
                      ? 'page'
                      : undefined
                  }
                >
                  Templates
                </Link>
                <button
                  ref={megaTriggerRef}
                  type="button"
                  className={`nl mega-trigger${megaOpen ? ' is-hover' : ''}`}
                  aria-expanded={megaOpen}
                  aria-controls="mega-formats"
                  onClick={() => setMegaOpen((o) => !o)}
                  onMouseEnter={() => {
                    if (isFinePointer()) scheduleMega(true, 120);
                  }}
                  onMouseLeave={() => {
                    if (isFinePointer()) scheduleMega(false, 220);
                  }}
                >
                  Biodata formats <MegaChevron />
                </button>
                <Link href={howHref} className="nl">
                  How it works
                </Link>
                <Link href={pricingHref} className="nl">
                  Pricing
                </Link>
                <span className="nav-sep" aria-hidden />
                {isAuthed ? (
                  <HeaderAccountMenu
                    open={menuOpen}
                    onOpenChange={setMenuOpen}
                    pathname={pathname}
                    name={user?.name}
                    email={user?.email}
                    initials={userInitials}
                    isPremium={Boolean(user?.isPremium)}
                    isAdmin={isAdmin}
                    onLogout={() => {
                      void logout();
                    }}
                  />
                ) : (
                  <>
                    <Link
                      href="/login/"
                      className="nl"
                      aria-current={
                        pathMatches(pathname, '/login') ? 'page' : undefined
                      }
                    >
                      Sign in
                    </Link>
                    <Link href="/register/" className="btn btn-primary btn-sm">
                      Sign up
                    </Link>
                  </>
                )}
              </nav>
            </>
          )}
        </div>
        {!isMinimal ? (
          <HeaderMegaMenu
            open={megaOpen}
            pathname={pathname}
            showPassCard={!isAuthed || !user?.isPremium}
            onClose={closeMega}
            triggerRef={megaTriggerRef}
            onHoverEnter={() => {
              if (isFinePointer()) {
                clearHover();
                setMegaOpen(true);
              }
            }}
            onHoverLeave={() => {
              if (isFinePointer()) scheduleMega(false, 220);
            }}
          />
        ) : null}
      </header>

      {!isMinimal ? (
        <MobileNavDrawer
          open={drawerOpen}
          onClose={closeDrawer}
          pathname={pathname}
          howHref={howHref}
          pricingHref={pricingHref}
          isAuthed={isAuthed}
          isPremium={Boolean(user?.isPremium)}
          isAdmin={isAdmin}
          name={user?.name}
          email={user?.email}
          initials={userInitials}
          onLogout={() => {
            void logout();
          }}
        />
      ) : null}
    </>
  );
}
