'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAdminOverview, type AdminOverview } from '../services/adminApi';
import { defaultRangeDays, formatInr, toInputDate } from '../utils/adminFormat';
import { IncomeBars } from './IncomeBars';

type Granularity = 'day' | 'week' | 'month';

export function AdminDashboard() {
  const initial = defaultRangeDays(30);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [granularity, setGranularity] = useState<Granularity>('day');
  const [applied, setApplied] = useState({ from: initial.from, to: initial.to, granularity: 'day' as Granularity });
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const ov = await fetchAdminOverview(applied);
        if (!cancelled) setData(ov);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard');
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
    setApplied({ from, to, granularity });
  }

  function preset(days: number) {
    const range = defaultRangeDays(days);
    setFrom(range.from);
    setTo(range.to);
    setGranularity(days > 90 ? 'month' : days > 45 ? 'week' : 'day');
    setApplied({
      from: range.from,
      to: range.to,
      granularity: days > 90 ? 'month' : days > 45 ? 'week' : 'day',
    });
  }

  return (
    <div className="admin-view">
      <div className="admin-view-head">
        <div>
          <h1>Dashboard</h1>
          <p>Wedding Pass income and account health.</p>
        </div>
        <Link href="/admin/payments" className="btn btn-line btn-sm">
          View all payments
        </Link>
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
          <span>Group by</span>
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as Granularity)}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </label>
        <div className="admin-filter-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => preset(7)}>
            7d
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => preset(30)}>
            30d
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => preset(90)}>
            90d
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            Apply
          </button>
        </div>
      </form>

      {loading ? <p className="admin-muted">Loading dashboard…</p> : null}
      {error ? (
        <p className="err" role="alert">
          {error}
        </p>
      ) : null}

      {data ? (
        <>
          <section className="admin-kpi-grid" aria-label="Key metrics">
            <article className="admin-kpi highlight">
              <small>Income in range</small>
              <b>{formatInr(data.range.incomeInr)}</b>
              <span>{data.range.orderCount} fulfilled orders</span>
            </article>
            <article className="admin-kpi">
              <small>All-time revenue</small>
              <b>{formatInr(data.revenueInr)}</b>
              <span>{data.paymentsFulfilled} paid total</span>
            </article>
            <article className="admin-kpi">
              <small>Active Wedding Pass</small>
              <b>{data.activeWeddingPass}</b>
              <span>{data.users} users</span>
            </article>
            <article className="admin-kpi">
              <small>Pending / failed</small>
              <b>
                {data.paymentsPending}
                <span className="admin-kpi-sep">/</span>
                {data.paymentsFailed}
              </b>
              <span>{data.biodatas} biodatas saved</span>
            </article>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <h2>Income</h2>
              <p>
                {data.range.granularity} bars · {formatInr(data.range.incomeInr)}
              </p>
            </div>
            <IncomeBars series={data.incomeSeries} />
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <h2>Status mix</h2>
              <p>Orders created in selected range</p>
            </div>
            {data.statusBreakdown.length === 0 ? (
              <p className="admin-muted">No orders in this range.</p>
            ) : (
              <ul className="admin-status-list">
                {data.statusBreakdown.map((row) => (
                  <li key={row.status}>
                    <span className={`admin-pill ${row.status}`}>{row.status}</span>
                    <span>{row.count} orders</span>
                    <b>{formatInr(row.amountInr)}</b>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
