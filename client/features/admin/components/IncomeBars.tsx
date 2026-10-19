'use client';

import type { AdminIncomePoint } from '../services/adminApi';
import { formatInr } from '../utils/adminFormat';

export function IncomeBars({ series }: { series: AdminIncomePoint[] }) {
  if (!series.length) {
    return (
      <div className="admin-chart empty">
        <p>No fulfilled payments in this range.</p>
      </div>
    );
  }

  const max = Math.max(...series.map((p) => p.amountInr), 1);

  return (
    <div className="admin-chart" role="img" aria-label="Income by period">
      <div className="admin-bars">
        {series.map((point) => {
          const height = Math.max(4, Math.round((point.amountInr / max) * 100));
          return (
            <div key={point.period} className="admin-bar-col">
              <div className="admin-bar-value" title={formatInr(point.amountInr)}>
                {point.amountInr > 0 ? `₹${point.amountInr}` : ''}
              </div>
              <div className="admin-bar-track">
                <div
                  className="admin-bar"
                  style={{ height: `${height}%` }}
                  title={`${point.label}: ${formatInr(point.amountInr)} · ${point.count} orders`}
                />
              </div>
              <div className="admin-bar-label">{point.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
