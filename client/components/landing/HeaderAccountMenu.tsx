'use client';

import Link from 'next/link';
import { useEffect, useId, useRef } from 'react';
import { MegaChevron, pathMatches } from './navIcons';

type HeaderAccountMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
  name?: string | null;
  email?: string | null;
  initials: string;
  isPremium: boolean;
  isAdmin: boolean;
  onLogout: () => void;
};

export function HeaderAccountMenu({
  open,
  onOpenChange,
  pathname,
  name,
  email,
  initials,
  isPremium,
  isAdmin,
  onLogout,
}: HeaderAccountMenuProps) {
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const firstName = (name || '').split(/\s+/)[0] || 'Account';
  const badge = isPremium ? 'PASS' : 'FREE';

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) onOpenChange(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false);
    }
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div className="menu-wrap" ref={wrapRef}>
      <button
        className="avatar-btn"
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(!open);
        }}
      >
        <span className="avatar" aria-hidden>
          {initials}
        </span>
        <span>{firstName}</span>
        <span
          className={`mini-badge${isPremium ? ' prem' : ''}`}
          title={isPremium ? 'Wedding Pass' : 'Free plan'}
        >
          {badge}
        </span>
        <MegaChevron />
        <span className="sr-only">Account menu</span>
      </button>
      <div
        className={`menu${open ? ' open' : ''}`}
        id={menuId}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <div className="menu-id">
          <b>{name || firstName}</b>
          {email ? <span>{email}</span> : null}
          <span className={`mini-badge${isPremium ? ' prem' : ''}`}>
            {badge} plan
          </span>
        </div>
        <Link href="/" onClick={() => onOpenChange(false)}>
          Create biodata
        </Link>
        <Link
          href="/my-designs/"
          aria-current={pathMatches(pathname, '/my-designs') ? 'page' : undefined}
          onClick={() => onOpenChange(false)}
        >
          My Designs
        </Link>
        <Link href="/account/" onClick={() => onOpenChange(false)}>
          Profile
        </Link>
        {!isPremium ? (
          <Link href="/wedding-pass/" onClick={() => onOpenChange(false)}>
            Get Wedding Pass
          </Link>
        ) : null}
        {isAdmin ? (
          <Link href="/admin/" onClick={() => onOpenChange(false)}>
            Admin panel
          </Link>
        ) : null}
        <hr />
        <button
          type="button"
          className="menu-item"
          onClick={() => {
            onOpenChange(false);
            onLogout();
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
