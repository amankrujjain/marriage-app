'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { BiodataRecord } from '@marriage/shared';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { MotifBg } from '@/components/landing/MotifBg';
import { ApiClientError } from '@/lib/apiClient';
import { useAppDispatch } from '@/store/hooks';
import { listBiodata } from '../services/biodataApi';
import { loadBiodata } from '../store/biodataSlice';
import { photoFitImgStyle } from '../utils/photoFit';

function formatDate(iso: string): string {
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

export function MyDesignsPanel() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [items, setItems] = useState<BiodataRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const limit = 12;

  const load = useCallback(async (nextPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await listBiodata(nextPage, limit);
      setItems(result.items);
      setTotal(result.meta.total);
      setPage(result.meta.page);
    } catch (err) {
      setError(
        err instanceof ApiClientError || err instanceof Error
          ? err.message
          : 'Could not load your designs',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(1);
  }, [load]);

  async function openDesign(record: BiodataRecord): Promise<void> {
    setOpeningId(record.id);
    try {
      dispatch(
        loadBiodata({
          id: record.id,
          title: record.title,
          content: record.content,
        }),
      );
      router.push(`/marriage-biodata-maker?id=${record.id}`);
    } finally {
      setOpeningId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="landing app-shell">
      <SiteHeader variant="app" />
      <main className="app-page">
        <MotifBg />
        <div className="app-page-inner">
          <header className="app-page-head">
            <div>
              <h1>My Designs</h1>
              <p>Biodatas you have saved — open one to keep editing.</p>
            </div>
            <Link href="/marriage-biodata-maker" className="btn-primary">
              New biodata
            </Link>
          </header>

          {loading ? (
            <p className="app-page-status">Loading your designs…</p>
          ) : null}
          {error ? <p className="app-page-error">{error}</p> : null}

          {!loading && !error && items.length === 0 ? (
            <div className="my-designs-empty">
              <p>No saved biodatas yet.</p>
              <Link href="/templates" className="btn-primary">
                Browse templates
              </Link>
            </div>
          ) : null}

          {items.length > 0 ? (
            <ul className="my-designs-grid">
              {items.map((record) => {
                const name =
                  record.content.personal.fullName?.trim() ||
                  record.title ||
                  'Untitled biodata';
                const photo = record.content.profilePhotoUrl;
                const fit = record.content.profilePhotoFit;
                return (
                  <li key={record.id} className="my-designs-card">
                    <div className="my-designs-thumb">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo} alt="" style={photoFitImgStyle(fit)} />
                      ) : (
                        <span className="my-designs-thumb-empty" />
                      )}
                    </div>
                    <div className="my-designs-card-body">
                      <h2>{name}</h2>
                      <p>Updated {formatDate(record.updatedAt)}</p>
                      <button
                        type="button"
                        className="editor-btn-outline"
                        disabled={openingId === record.id}
                        onClick={() => void openDesign(record)}
                      >
                        {openingId === record.id ? 'Opening…' : 'Open'}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {totalPages > 1 ? (
            <div className="my-designs-pager">
              <button
                type="button"
                className="editor-btn-ghost"
                disabled={page <= 1 || loading}
                onClick={() => void load(page - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="editor-btn-ghost"
                disabled={page >= totalPages || loading}
                onClick={() => void load(page + 1)}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
