'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import {
  getDesignShortcuts,
  getFormatsNavHubs,
  type FormatsNavHub,
} from '@/content/nav/formatsNav';
import { BrandLogo } from './BrandLogo';
import { MegaDesignThumb } from './MegaDesignThumb';
import { CloseIcon, MegaChevron, pathMatches } from './navIcons';

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  pathname: string;
  howHref: string;
  pricingHref: string;
  isAuthed: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  name?: string | null;
  email?: string | null;
  initials: string;
  onLogout: () => void;
};

function DrawerAccordion({
  hub,
  pathname,
  openId,
  onToggle,
}: {
  hub: FormatsNavHub;
  pathname: string;
  openId: string | null;
  onToggle: (id: string) => void;
}) {
  const panelId = `dp-${hub.id}`;
  const expanded = openId === hub.id;
  return (
    <div className={`drawer-acc${expanded ? ' open' : ''}`}>
      <h3>
        <button
          type="button"
          className="drawer-row"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => onToggle(hub.id)}
        >
          {hub.label}
          <MegaChevron />
        </button>
      </h3>
      <div
        className="drawer-panel"
        id={panelId}
        role="region"
        aria-label={hub.label}
        inert={!expanded ? true : undefined}
      >
        <div>
          <ul>
            {hub.links.map((link) => (
              <li key={link.href}>
                <Link
                  className="drawer-link"
                  href={link.href}
                  aria-current={
                    pathMatches(pathname, link.href) ? 'page' : undefined
                  }
                  tabIndex={expanded ? undefined : -1}
                >
                  <b lang={link.lang}>{link.label}</b>
                  <span lang={link.descLang}>{link.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function MobileNavDrawer({
  open,
  onClose,
  pathname,
  howHref,
  pricingHref,
  isAuthed,
  isPremium,
  isAdmin,
  name,
  email,
  initials,
  onLogout,
}: MobileNavDrawerProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { isLaunch, hubs } = getFormatsNavHubs();
  const shortcuts = getDesignShortcuts();
  const [openAcc, setOpenAcc] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setOpenAcc(null);
      return;
    }
    closeRef.current?.focus();
    document.documentElement.classList.add('drawer-open');
    return () => document.documentElement.classList.remove('drawer-open');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className="drawer-scrim"
        aria-hidden
        onClick={onClose}
        style={open ? undefined : { pointerEvents: 'none' }}
      />
      <div
        className="drawer"
        id="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        inert={!open ? true : undefined}
      >
        <div className="drawer-top">
          <BrandLogo href="/" />
          <span id={titleId} className="sr-only">
            Menu
          </span>
          <button
            ref={closeRef}
            type="button"
            className="drawer-close"
            aria-label="Close menu"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="drawer-body" aria-label="Main">
          {isAuthed ? (
            <>
              <div className="drawer-account">
                <span className="avatar" aria-hidden>
                  {initials}
                </span>
                <div>
                  <b>{(name || '').split(/\s+/)[0] || 'Account'}</b>
                  {email ? <span>{email}</span> : null}
                </div>
                <span className={`mini-badge${isPremium ? ' prem' : ''}`}>
                  {isPremium ? 'PASS' : 'FREE'}
                </span>
              </div>
              <Link
                className="drawer-row"
                href="/my-designs/"
                aria-current={
                  pathMatches(pathname, '/my-designs') ? 'page' : undefined
                }
                onClick={onClose}
              >
                My Designs
              </Link>
              <Link className="drawer-row" href="/account/" onClick={onClose}>
                Profile
              </Link>
              {!isPremium ? (
                <Link
                  className="drawer-row"
                  href="/wedding-pass/"
                  onClick={onClose}
                >
                  Get Wedding Pass
                </Link>
              ) : null}
              {isAdmin ? (
                <Link className="drawer-row" href="/admin/" onClick={onClose}>
                  Admin
                </Link>
              ) : null}
            </>
          ) : null}

          <p className="drawer-label">Biodata formats</p>
          {isLaunch ? (
            <>
              <Link
                className="drawer-row"
                href="/"
                aria-current={pathname === '/' ? 'page' : undefined}
                onClick={onClose}
              >
                Create biodata
              </Link>
              <Link
                className="drawer-row"
                href="/templates/"
                aria-current={
                  pathMatches(pathname, '/templates') ? 'page' : undefined
                }
                onClick={onClose}
              >
                Templates
              </Link>
              <p className="drawer-label" id="dl-designs">
                Designs
              </p>
              <ul className="drawer-designs" aria-labelledby="dl-designs">
                {shortcuts.map((d) => (
                  <li key={d.slug}>
                    <Link
                      className="mega-design"
                      href={`/?design=${d.slug}`}
                      onClick={onClose}
                    >
                      <MegaDesignThumb slug={d.slug} />
                      <span className="mega-design-meta">
                        <b>{d.name}</b>
                        <span
                          className={`mega-badge${d.tier === 'Premium' ? ' prem' : ''}`}
                        >
                          {d.tier}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                className="drawer-row"
                href="/templates/"
                onClick={onClose}
              >
                See all designs and filter
              </Link>
            </>
          ) : (
            hubs.map((hub) => (
              <DrawerAccordion
                key={hub.id}
                hub={hub}
                pathname={pathname}
                openId={openAcc}
                onToggle={(id) =>
                  setOpenAcc((cur) => (cur === id ? null : id))
                }
              />
            ))
          )}

          <p className="drawer-label">MarriageBio</p>
          <Link className="drawer-row" href={howHref} onClick={onClose}>
            How it works
          </Link>
          <Link className="drawer-row" href={pricingHref} onClick={onClose}>
            Pricing
          </Link>
          {isAuthed ? (
            <button
              type="button"
              className="drawer-row"
              onClick={() => {
                onClose();
                onLogout();
              }}
            >
              Sign out
            </button>
          ) : null}
        </nav>
        {isAuthed ? (
          <div className="drawer-foot one">
            <Link className="btn btn-primary" href="/" onClick={onClose}>
              Create biodata
            </Link>
          </div>
        ) : (
          <div className="drawer-foot">
            <Link className="btn btn-line" href="/login/" onClick={onClose}>
              Sign in
            </Link>
            <Link
              className="btn btn-primary"
              href="/register/"
              onClick={onClose}
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
