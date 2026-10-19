'use client';

import { useEffect, useState } from 'react';
import {
  downloadAdminPaymentsCsv,
  fetchAdminPayments,
  type AdminPayment,
  type AdminPaymentsResult,
} from '../services/adminApi';
import {
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  defaultRangeDays,
  formatDateTime,
  formatInr,
  formatPaymentMethod,
  toInputDate,
} from '../utils/adminFormat';

export function AdminPaymentsPage() {
  const initial = defaultRangeDays(90);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [q, setQ] = useState('');
  const [applied, setApplied] = useState({
    from: initial.from,
    to: initial.to,
    status: '',
    method: '',
    q: '',
    page: 1,
  });
  const [data, setData] = useState<AdminPaymentsResult | null>(null);
  const [selected, setSelected] = useState<AdminPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAdminPayments({
          page: applied.page,
          limit: 20,
          status: applied.status || undefined,
          method: applied.method || undefined,
          from: applied.from || undefined,
          to: applied.to || undefined,
          q: applied.q || undefined,
        });
        if (!cancelled) {
          setData(result);
          setSelected((prev) => {
            if (prev && result.items.some((item) => item.id === prev.id)) {
              return result.items.find((item) => item.id === prev.id) ?? null;
            }
            return result.items[0] ?? null;
          });
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
  }, [applied]);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    setApplied({ from, to, status, method, q: q.trim(), page: 1 });
  }

  function goPage(next: number) {
    setApplied((prev) => ({ ...prev, page: next }));
  }

  async function onExport() {
    setExporting(true);
    setError(null);
    try {
      await downloadAdminPaymentsCsv({
        status: applied.status || undefined,
        method: applied.method || undefined,
        from: applied.from || undefined,
        to: applied.to || undefined,
        q: applied.q || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  }

  const meta = data?.meta;

  return (
    <div className="admin-view">
      <div className="admin-view-head">
        <div>
          <h1>Payments</h1>
          <p>All Wedding Pass orders with status and provider details.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={exporting || loading}
          onClick={() => void onExport()}
        >
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      <form className="admin-filters" onSubmit={applyFilters}>
        <label>
          <span>From</span>
          <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label>
          <span>To</span>
          <input
            type="date"
            value={to}
            min={from}
            max={toInputDate(new Date())}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s || 'all'} value={s}>
                {s ? s : 'All statuses'}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Mode</span>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value || 'all'} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-filter-grow">
          <span>Search</span>
          <input
            type="search"
            placeholder="Email, name, order id…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <div className="admin-filter-actions">
          <button type="submit" className="btn btn-primary btn-sm">
            Apply
          </button>
        </div>
      </form>

      {loading ? <p className="admin-muted">Loading payments…</p> : null}
      {error ? (
        <p className="err" role="alert">
          {error}
        </p>
      ) : null}

      <div className="admin-payments-layout">
        <section className="admin-card admin-table-card">
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Created</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Provider order</th>
                </tr>
              </thead>
              <tbody>
                {!data?.items.length ? (
                  <tr>
                    <td colSpan={6} className="admin-muted">
                      No payments match these filters.
                    </td>
                  </tr>
                ) : (
                  data.items.map((p) => (
                    <tr
                      key={p.id}
                      className={selected?.id === p.id ? 'selected' : ''}
                      onClick={() => setSelected(p)}
                    >
                      <td>{formatDateTime(p.createdAt)}</td>
                      <td>
                        <div className="admin-user-cell">
                          <strong>{p.userName || 'Unknown'}</strong>
                          <span>{p.userEmail || p.userId}</span>
                        </div>
                      </td>
                      <td>{formatInr(p.amountInr)}</td>
                      <td>
                        <span className={`admin-method ${p.paymentMethod || 'unknown'}`}>
                          {formatPaymentMethod(p.paymentMethod, p.paymentMethodDetail)}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-pill ${p.status}`}>{p.status}</span>
                      </td>
                      <td className="mono">{p.providerOrderId || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {meta ? (
            <div className="admin-pager">
              <p>
                Page {meta.page} of {meta.totalPages} · {meta.total} total
              </p>
              <div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={meta.page <= 1 || loading}
                  onClick={() => goPage(meta.page - 1)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={meta.page >= meta.totalPages || loading}
                  onClick={() => goPage(meta.page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <aside className="admin-card admin-detail">
          <h2>Payment details</h2>
          {!selected ? (
            <p className="admin-muted">Select a row to inspect full details.</p>
          ) : (
            <dl className="admin-detail-list">
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={`admin-pill ${selected.status}`}>{selected.status}</span>
                </dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd>
                  {formatInr(selected.amountInr)} {selected.currency}
                </dd>
              </div>
              <div>
                <dt>Mode of payment</dt>
                <dd>
                  {formatPaymentMethod(
                    selected.paymentMethod,
                    selected.paymentMethodDetail,
                  )}
                  {selected.paymentMethod ? (
                    <>
                      <br />
                      <span className="admin-muted">{selected.paymentMethod}</span>
                    </>
                  ) : null}
                </dd>
              </div>
              <div>
                <dt>Plan</dt>
                <dd>{selected.planSlug}</dd>
              </div>
              <div>
                <dt>User</dt>
                <dd>
                  {selected.userName || '—'}
                  <br />
                  <span className="admin-muted">{selected.userEmail || '—'}</span>
                </dd>
              </div>
              <div>
                <dt>User ID</dt>
                <dd className="mono">{selected.userId}</dd>
              </div>
              <div>
                <dt>Order ID</dt>
                <dd className="mono">{selected.id}</dd>
              </div>
              <div>
                <dt>Provider order</dt>
                <dd className="mono">{selected.providerOrderId || '—'}</dd>
              </div>
              <div>
                <dt>Provider payment</dt>
                <dd className="mono">{selected.providerPaymentId || '—'}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{formatDateTime(selected.createdAt)}</dd>
              </div>
              <div>
                <dt>Paid</dt>
                <dd>{formatDateTime(selected.paidAt)}</dd>
              </div>
              <div>
                <dt>Fulfilled</dt>
                <dd>{formatDateTime(selected.fulfilledAt)}</dd>
              </div>
              <div>
                <dt>Failed / cancelled</dt>
                <dd>
                  {formatDateTime(selected.failedAt)} / {formatDateTime(selected.cancelledAt)}
                </dd>
              </div>
              {selected.lastError ? (
                <div>
                  <dt>Last error</dt>
                  <dd className="err">{selected.lastError}</dd>
                </div>
              ) : null}
            </dl>
          )}
        </aside>
      </div>
    </div>
  );
}
