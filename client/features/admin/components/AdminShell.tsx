'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';

const NAV = [
  {
    href: '/admin',
    label: 'Dashboard',
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M4 13h7V4H4v9zm9 7h7V4h-7v16zM4 20h7v-5H4v5z" />
      </svg>
    ),
  },
  {
    href: '/admin/payments',
    label: 'Payments',
    exact: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18M7 15h4" />
      </svg>
    ),
  },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const initials = (user?.name || 'A')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="admin-app">
      <aside className={`admin-side${open ? ' open' : ''}`}>
        <div className="admin-side-brand">
          <Link href="/admin" onClick={() => setOpen(false)}>
            <span className="admin-side-mark">V</span>
            <span>
              <b>Vivah Patra</b>
              <small>Admin console</small>
            </span>
          </Link>
          <button
            type="button"
            className="admin-side-close"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="admin-side-nav" aria-label="Admin">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-side-link${active ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span className="admin-side-ico">{item.icon}</span>
                <span className="admin-side-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-side-foot">
          <Link href="/account" className="admin-side-exit" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M9 6H5v12h4M13 12H5M16 8l4 4-4 4" />
            </svg>
            Exit to app
          </Link>
          <p>Internal only</p>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          className="admin-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="admin-main">
        <header className="admin-top">
          <button
            type="button"
            className="admin-menu-btn"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="admin-top-meta">
            <div className="admin-top-user">
              <span className="admin-top-avatar">{initials}</span>
              <span>
                <b>{user?.name}</b>
                <small className="admin-top-badge">Admin</small>
              </span>
            </div>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
