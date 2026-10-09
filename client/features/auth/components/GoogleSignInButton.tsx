'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { googleAuthRequest } from '../services/authApi';
import { authFailed, authLoading, authSuccess } from '../store/authSlice';
import { ApiClientError } from '@/lib/apiClient';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

export function GoogleSignInButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!clientId || !buttonRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          dispatch(authLoading());
          try {
            const data = await googleAuthRequest({ idToken: response.credential });
            dispatch(authSuccess(data.user));
            router.push('/account');
          } catch (error) {
            const message =
              error instanceof ApiClientError ? error.message : 'Google sign-in failed';
            dispatch(authFailed(message));
          }
        },
      });
      if (buttonRef.current) {
        window.google?.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
        });
        setReady(true);
      }
    };
    document.body.appendChild(script);
  }, [dispatch, router]);

  if (!clientId) {
    return (
      <p className="text-center font-body text-xs text-ink/50">
        Google sign-in available when GOOGLE_CLIENT_ID is configured.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={buttonRef} />
      {!ready ? <p className="text-xs text-ink/50">Loading Google…</p> : null}
    </div>
  );
}
