'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authSuccess } from '@/features/auth/store/authSlice';
import { globalLoadingHide, globalLoadingShow } from '@/store/slices/uiSlice';
import {
  checkoutWeddingPass,
  verifyWeddingPassPayment,
} from '../services/billingApi';

function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-razorpay="1"]',
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Razorpay script failed')), {
        once: true,
      });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpay = '1';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Razorpay'));
    document.body.appendChild(script);
  });
}

export function useWeddingPassCheckout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authStatus = useAppSelector((state) => state.auth.status);
  const user = useAppSelector((state) => state.auth.user);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const startCheckout = useCallback(async (): Promise<boolean> => {
    if (authStatus !== 'authenticated' || !user) {
      router.push('/login?next=/wedding-pass');
      return false;
    }
    if (user.isPremium) {
      router.push('/download');
      return true;
    }

    setBusy(true);
    setError(null);
    dispatch(globalLoadingShow('Opening secure payment…'));
    try {
      await loadRazorpayScript();
      const idempotencyKey =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `wp_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      const order = await checkoutWeddingPass(idempotencyKey);
      const Razorpay = window.Razorpay;
      if (!Razorpay) throw new Error('Razorpay unavailable');

      dispatch(globalLoadingHide());

      await new Promise<void>((resolve, reject) => {
        const rzp = new Razorpay({
          key: order.keyId,
          amount: order.amountMinor,
          currency: order.currency,
          name: 'Vivah Patra',
          description: order.planName,
          order_id: order.providerOrderId,
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone,
          },
          theme: { color: '#681421' },
          handler: (response) => {
            void (async () => {
              try {
                dispatch(globalLoadingShow('Confirming your Wedding Pass…'));
                const result = await verifyWeddingPassPayment({
                  providerOrderId: response.razorpay_order_id,
                  providerPaymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                });
                dispatch(authSuccess(result.user));
                resolve();
              } catch (err) {
                reject(err instanceof Error ? err : new Error('Verification failed'));
              } finally {
                dispatch(globalLoadingHide());
              }
            })();
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
        });
        rzp.open();
      });

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Payment could not be completed';
      if (message !== 'Payment cancelled') setError(message);
      return false;
    } finally {
      setBusy(false);
      dispatch(globalLoadingHide());
    }
  }, [authStatus, dispatch, router, user]);

  return { startCheckout, busy, error, setError };
}
