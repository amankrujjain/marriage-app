'use client';

import type { BlogSeoScoreResult } from '@marriage/shared';

type BlogSeoPanelProps = {
  result: BlogSeoScoreResult | null;
  loading?: boolean;
};

export function BlogSeoPanel({ result, loading }: BlogSeoPanelProps) {
  return (
    <div className="admin-card blog-seo-panel">
      <div className="admin-card-head">
        <h2>SEO score</h2>
        <p>
          {loading
            ? 'Scoring…'
            : result
              ? `${result.score}/100`
              : 'Type to score'}
        </p>
      </div>
      {!result ? (
        <p className="admin-muted" style={{ margin: 0 }}>
          Scores update a moment after you stop typing. Nothing is saved until
          you click Save.
        </p>
      ) : (
        <ul className="blog-seo-list">
          {result.checks.map((check) => (
            <li key={check.id} data-level={check.level}>
              <strong>{check.label}</strong>
              <span>{check.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
