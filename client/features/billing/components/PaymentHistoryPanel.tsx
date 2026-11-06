'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { UserPaymentListItem } from '@marriage/shared';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { OrnamentDiv } from '@/components/landing/Ornaments';
import { useAppDispatch } from '@/store/hooks';
import { authSuccess } from '@/features/auth/store/authSlice';
import { fetchMe } from '@/features/auth/services/authApi';
import { getInvoiceUrl, listMyPayments } from '../services/billingApi';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

function formatInr(amountInr: number): string {
  return `₹${amountInr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function PaymentHistoryPanel() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<UserPaymentListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceBusyId, setInvoiceBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const fresh = await fetchMe();
        if (!cancelled) dispatch(authSuccess(fresh));
      } catch {
        /* keep existing session */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listMyPayments(page, 20);
        if (!cancelled) {
          setItems(data.items);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load payments');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page]);

  async function openInvoice(orderId: string) {
    setInvoiceBusyId(orderId);
    setError(null);
    try {
      const { url } = await getInvoiceUrl(orderId);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open invoice');
    } finally {
      setInvoiceBusyId(null);
    }
  }

  return (
    <div className="landing">
      <SiteHeader variant="app" />
      <div className="auth-bg" style={{ minHeight: 'calc(100vh - 74px)' }}>
        <main id="main" className="prof" style={{ position: 'relative', zIndex: 1 }}>
          <div className="prof-card" style={{ maxWidth: 720 }}>
            <h1>Payment history</h1>
            <OrnamentDiv className="orn" />
            <p className="hello" style={{ marginBottom: 20 }}>
              Your Wedding Pass purchases and invoices.
            </p>

            {loading ? <p>Loading…</p> : null}
            {error ? <p style={{ color: '#a11' }}>{error}</p> : null}

            {!loading && items.length === 0 ? (
              <p>No payments yet.</p>
            ) : null}

            {!loading && items.length > 0 ? (
              <ul className="kv" style={{ gap: 12 }}>
                {items.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      display: 'grid',
                      gap: 6,
                      paddingBottom: 12,
                      borderBottom: '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <strong>{formatDate(item.paidAt ?? item.createdAt)}</strong>
                      <span>{formatInr(item.amountInr)}</span>
                    </div>
                    <div style={{ fontSize: 14 }}>
                      {item.planSlug} · {item.status}
                      {item.paymentMethodDetail || item.paymentMethod
                        ? ` · ${item.paymentMethodDetail || item.paymentMethod}`
                        : ''}
                    </div>
                    {item.status === 'fulfilled' ? (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ minHeight: 40, width: 'fit-content' }}
                        disabled={invoiceBusyId === item.id}
                        onClick={() => void openInvoice(item.id)}
                      >
                        {invoiceBusyId === item.id
                          ? 'Opening…'
                          : item.invoiceNumber
                            ? `Invoice ${item.invoiceNumber}`
                            : 'Invoice'}
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}

            {totalPages > 1 ? (
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <span style={{ alignSelf: 'center', fontSize: 14 }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            ) : null}

            <Link
              className="btn btn-ghost btn-block"
              href="/account"
              style={{ minHeight: 50, marginTop: 24 }}
            >
              Back to account
            </Link>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
