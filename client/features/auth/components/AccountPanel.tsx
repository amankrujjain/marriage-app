'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { useAuthActions } from '../hooks/useAuthActions';
import { MotifBg } from '@/components/landing/MotifBg';

export function AccountPanel() {
  const user = useAppSelector((state) => state.auth.user);
  const { logout } = useAuthActions();

  if (!user) return null;

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <MotifBg />
      <section className="relative z-10 w-full max-w-md text-center">
        <p className="font-display text-3xl text-maroon">Namaste, {user.name}</p>
        <div className="mx-auto mt-3 h-px w-16 bg-gold" />
        <p className="mt-4 font-body text-ink/75">{user.email}</p>
        <p className="mt-2 font-body text-sm text-ink/60">
          {user.isPremium ? 'Wedding Pass active' : 'Free plan — upgrade at export'}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/marriage-biodata-maker"
            className="inline-flex min-h-12 items-center justify-center bg-maroon px-6 font-body text-ivory"
          >
            Create Marriage Biodata
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="min-h-12 font-body text-maroon underline decoration-gold underline-offset-4"
          >
            Sign out
          </button>
        </div>
      </section>
    </main>
  );
}
