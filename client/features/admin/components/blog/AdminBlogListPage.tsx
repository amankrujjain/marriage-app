'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { BlogPostStatus, type AdminBlogPostSummary } from '@marriage/shared';
import {
  deleteAdminBlogPost,
  listAdminBlogPosts,
} from '@/features/admin/services/adminApi';
import { formatDateTime } from '@/features/admin/utils/adminFormat';


const STATUS_FILTERS: Array<{ value: '' | BlogPostStatus; label: string }> = [
  { value: '', label: 'All' },
  { value: BlogPostStatus.DRAFT, label: 'Draft' },
  { value: BlogPostStatus.SCHEDULED, label: 'Scheduled' },
  { value: BlogPostStatus.PUBLISHED, label: 'Published' },
];

function statusClass(status: BlogPostStatus): string {
  if (status === BlogPostStatus.PUBLISHED) return 'admin-pill fulfilled';
  if (status === BlogPostStatus.SCHEDULED) return 'admin-pill pending';
  return 'admin-pill';
}

export function AdminBlogListPage() {
  const [items, setItems] = useState<AdminBlogPostSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<'' | BlogPostStatus>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listAdminBlogPosts({
        page,
        limit: 25,
        status,
        search: search.trim() || undefined,
      });
      setItems(result.items);
      setTotalPages(result.meta.totalPages);
      setTotal(result.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onDelete(post: AdminBlogPostSummary) {
    if (
      !window.confirm(
        `Delete “${post.title}”? This soft-deletes the post and keeps the slug reserved.`,
      )
    ) {
      return;
    }
    setDeleting(post.id);
    setError(null);
    try {
      await deleteAdminBlogPost(post.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="admin-view-head">
        <div>
          <h1>Blog</h1>
          <p>Draft, schedule and publish MarriageBio articles.</p>
        </div>
        <Link href="/admin/blog/new/" className="btn btn-primary btn-sm">
          New post
        </Link>
      </div>

      <div className="admin-filters">
        <label className="admin-filter-grow">
          Search
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setPage(1);
                setSearch(searchInput);
              }
            }}
            placeholder="Title or slug"
          />
        </label>
        <label>
          Status
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as '' | BlogPostStatus);
            }}
          >
            {STATUS_FILTERS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <div className="admin-filter-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              setPage(1);
              setSearch(searchInput);
            }}
          >
            Apply
          </button>
        </div>
      </div>

      {error ? (
        <p className="admin-muted" style={{ color: '#8a1c1c' }}>
          {error}
        </p>
      ) : null}
      {loading ? <p className="admin-muted">Loading posts…</p> : null}

      {!loading && items.length === 0 ? (
        <div className="admin-card">
          <p className="admin-muted" style={{ margin: 0 }}>
            No posts yet. Create your first draft.
          </p>
        </div>
      ) : null}

      {!loading && items.length > 0 ? (
        <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Flags</th>
                <th>Published</th>
                <th>Updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link
                      href={`/admin/blog/${post.id}/`}
                      style={{ fontWeight: 600, color: 'var(--maroon)' }}
                    >
                      {post.title || '(untitled)'}
                    </Link>
                    <div className="admin-muted">{post.slug}</div>
                  </td>
                  <td>
                    <span className={statusClass(post.status)}>{post.status}</span>
                  </td>
                  <td>
                    {post.featured ? (
                      <span className="admin-pill">featured</span>
                    ) : null}{' '}
                    {post.noindex ? (
                      <span className="admin-pill failed">noindex</span>
                    ) : null}
                  </td>
                  <td className="admin-muted">
                    {post.publishedAt
                      ? formatDateTime(post.publishedAt)
                      : post.publishAt
                        ? formatDateTime(post.publishAt)
                        : '—'}
                  </td>
                  <td className="admin-muted">{formatDateTime(post.updatedAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <Link
                        href={`/admin/blog/${post.id}/`}
                        className="btn btn-ghost btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={deleting === post.id}
                        onClick={() => void onDelete(post)}
                      >
                        {deleting === post.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {totalPages > 1 ? (
        <div className="admin-pager">
          <p>
            Page {page} of {totalPages} · {total} posts
          </p>
          <div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
