'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { googleAuthRequest } from '../services/authApi';
import { authFailed, authLoading, authSuccess } from '../store/authSlice';
import { ApiClientError } from '@/lib/apiClient';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/account';
  return raw;
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.5 12.25c0-.8-.07-1.55-.2-2.25H12v4.26h5.9a5.05 5.05 0 0 1-2.19 3.31v2.75h3.55c2.08-1.92 3.24-4.74 3.24-8.07z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.75c-.98.66-2.24 1.06-3.73 1.06-2.87 0-5.3-1.94-6.17-4.55H2.16v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.83 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.16a11 11 0 0 0 0 9.88z"
      />
      <path
        fill="#EA4335"
        d="M12 5.35c1.62 0 3.06.56 4.2 1.65l3.15-3.15C17.45 2.1 14.97 1 12 1A11 11 0 0 0 2.16 7.06l3.67 2.84C6.7 7.29 9.13 5.35 12 5.35z"
      />
    </svg>
  );
}

export function GoogleSignInButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const nextPath = safeNextPath(searchParams.get('next'));

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
            router.push(nextPath);
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
          width: 380,
          text: 'continue_with',
        });
        setReady(true);
      }
    };
    document.body.appendChild(script);
  }, [dispatch, router, nextPath]);

  if (!clientId) {
    return (
      <>
        <div className="or">OR</div>
        <button
          className="btn btn-google btn-block"
          type="button"
          style={{ minHeight: 52 }}
          onClick={() =>
            setNote('Google sign-in needs GOOGLE_CLIENT_ID configured on this build.')
          }
        >
          <GoogleMark /> Continue with Google
        </button>
        {note ? <p className="note" style={{ textAlign: 'center' }}>{note}</p> : null}
      </>
    );
  }

  return (
    <>
      <div className="or">OR</div>
      <div style={{ display: 'grid', placeItems: 'center', minHeight: 52 }}>
        <div ref={buttonRef} />
        {!ready ? <p className="note">Loading Google…</p> : null}
      </div>
    </>
  );
}
