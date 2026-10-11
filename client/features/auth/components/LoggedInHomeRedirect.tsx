'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

/** Logged-in users skip the marketing home page. */
export function LoggedInHomeRedirect() {
  const router = useRouter();
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/account');
    }
  }, [status, router]);

  return null;
}
