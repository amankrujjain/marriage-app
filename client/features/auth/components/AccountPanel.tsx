'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { OrnamentDiv } from '@/components/landing/Ornaments';
import { useAppSelector } from '@/store/hooks';
import { useAuthActions } from '../hooks/useAuthActions';

export function AccountPanel() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { logout } = useAuthActions();

  if (!user) return null;

  const firstName = user.name.trim().split(/\s+/)[0] || 'there';

  async function onLogout(): Promise<void> {
    await logout();
    router.replace('/');
  }

  return (
    <div className="landing">
      <SiteHeader variant="app" />
      <div className="auth-bg" style={{ minHeight: 'calc(100vh - 74px)' }}>
        <main id="main" className="prof" style={{ position: 'relative', zIndex: 1 }}>
          <div className="prof-card">
            <h1>Profile</h1>
            <OrnamentDiv className="orn" />
            <p className="hello">Namaste, {firstName},</p>
            <ul className="kv">
              <li>
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="5" y="9" width="30" height="22" rx="3" />
                  <path d="M5 12l15 11 15-11" />
                </svg>
                <div>
                  <small>Email</small>
                  <span>{user.email}</span>
                </div>
              </li>
              <li>
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M10 6h6l3 8-4 2.5a18 18 0 0 0 9 9L26 21l8 3v6a3 3 0 0 1-3 3C18 33 7 22 7 9a3 3 0 0 1 3-3z" />
                </svg>
                <div>
                  <small>Phone</small>
                  <span>{user.phone?.trim() || 'Not added'}</span>
                </div>
              </li>
              <li>
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M6 28L4 12l9 7 7-12 7 12 9-7-2 16z" />
                  <path d="M7 33h26" />
                </svg>
                <div>
                  <small>Plan</small>
                  <span>
                    {user.isPremium ? 'Wedding Pass' : 'Free'}{' '}
                    {!user.isPremium ? <em>— upgrade at export</em> : null}
                  </span>
                </div>
              </li>
            </ul>
            <Link className="btn btn-primary btn-block" href="/my-designs" style={{ minHeight: 50 }}>
              My Designs
            </Link>
            <Link
              className="btn btn-ghost btn-block"
              href="/marriage-biodata-maker?new=1"
              style={{ minHeight: 50, borderColor: 'var(--maroon)' }}
            >
              Create Marriage Biodata
            </Link>
            <button
              className="btn btn-line btn-block"
              type="button"
              style={{ minHeight: 50 }}
              onClick={() => void onLogout()}
            >
              Sign out
            </button>
          </div>
        </main>
      </div>
      <SiteFooter slim />
    </div>
  );
}
