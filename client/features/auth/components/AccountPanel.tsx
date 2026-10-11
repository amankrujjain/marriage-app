'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { MotifBg } from '@/components/landing/MotifBg';
import { useAppSelector } from '@/store/hooks';
import { useAuthActions } from '../hooks/useAuthActions';

export function AccountPanel() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { logout } = useAuthActions();

  if (!user) return null;

  async function onLogout(): Promise<void> {
    await logout();
    router.replace('/');
  }

  return (
    <div className="landing app-shell">
      <SiteHeader variant="app" />
      <main className="app-page">
        <MotifBg />
        <div className="app-page-inner app-page-inner--narrow">
          <header className="app-page-head">
            <div>
              <h1>Profile</h1>
              <p>Your Vivah Patra account</p>
            </div>
          </header>

          <section className="profile-card">
            <p className="profile-name">Namaste, {user.name}</p>
            <dl className="profile-meta">
              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
              {user.phone ? (
                <div>
                  <dt>Phone</dt>
                  <dd>{user.phone}</dd>
                </div>
              ) : null}
              <div>
                <dt>Plan</dt>
                <dd>{user.isPremium ? 'Wedding Pass active' : 'Free — upgrade at export'}</dd>
              </div>
            </dl>

            <div className="profile-actions">
              <Link href="/my-designs" className="btn-primary">
                My Designs
              </Link>
              <Link href="/marriage-biodata-maker" className="editor-btn-outline">
                Create Marriage Biodata
              </Link>
              <button
                type="button"
                className="editor-btn-ghost"
                onClick={() => void onLogout()}
              >
                Sign out
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
