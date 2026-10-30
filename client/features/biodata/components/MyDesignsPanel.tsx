'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  emptyBiodataContent,
  mergeSectionsIntoContent,
  type BiodataContent,
  type BiodataRecord,
} from '@marriage/shared';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { OrnamentDivLotus } from '@/components/landing/Ornaments';
import { ApiClientError } from '@/lib/apiClient';
import { useAppDispatch } from '@/store/hooks';
import { selectDesign } from '@/features/templates/store/templateSlice';
import { globalLoadingHide, globalLoadingShow } from '@/store/slices/uiSlice';
import { deleteBiodata, listBiodata } from '../services/biodataApi';
import { loadBiodata, setDesignSlug } from '../store/biodataSlice';
import { designFromSlug } from './editor/designMap';
import { MyDesignThumb } from './MyDesignThumb';

function normalizeContent(
  content: BiodataContent | null | undefined,
  designSlug?: string,
): BiodataContent {
  const empty = emptyBiodataContent();
  if (!content || typeof content !== 'object') {
    return { ...empty, ...(designSlug ? { designSlug } : {}) };
  }
  return {
    ...empty,
    ...content,
    personal: { ...empty.personal, ...content.personal },
    education: { ...empty.education, ...content.education },
    career: { ...empty.career, ...content.career },
    family: { ...empty.family, ...content.family },
    about: { ...empty.about, ...content.about },
    contact: { ...empty.contact, ...content.contact },
    designSlug: designSlug?.trim() || content.designSlug?.trim() || undefined,
    hiddenFields: Array.isArray(content.hiddenFields) ? content.hiddenFields : [],
  };
}

function recordSlug(record: BiodataRecord): string {
  return (
    record.designSlug?.trim() ||
    record.content?.designSlug?.trim() ||
    'zari-traditional'
  );
}

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

function designDisplayName(record: BiodataRecord, fallback = 'Untitled biodata'): string {
  const merged = mergeSectionsIntoContent(
    normalizeContent(record.content, record.designSlug),
    record.editorSections,
  );
  return (
    merged.personal?.fullName?.trim() ||
    record.title?.trim() ||
    fallback
  );
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const limit = 12;

  const load = useCallback(async (nextPage: number) => {
    setLoading(true);
    setError(null);
    if (nextPage === 1) dispatch(globalLoadingShow('Loading your designs…'));
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
      dispatch(globalLoadingHide());
    }
  }, [dispatch]);

  useEffect(() => {
    void load(1);
  }, [load]);

  async function openDesign(record: BiodataRecord): Promise<void> {
    setOpeningId(record.id);
    try {
      const slug = recordSlug(record);
      const content = mergeSectionsIntoContent(
        normalizeContent(record.content, slug),
        record.editorSections,
      );
      dispatch(
        loadBiodata({
          id: record.id,
          title: record.title,
          content,
          designSlug: slug,
          editorSections: record.editorSections,
        }),
      );
      const design = designFromSlug(slug);
      if (design) {
        dispatch(selectDesign({ templateId: design.templateId, slug: design.slug }));
        dispatch(setDesignSlug(design.slug));
      }
      router.push(
        `/?id=${record.id}&design=${encodeURIComponent(slug)}`,
      );
    } finally {
      setOpeningId(null);
    }
  }

  async function onDelete(record: BiodataRecord): Promise<void> {
    const name = designDisplayName(record, 'this biodata');
    if (!window.confirm(`Delete “${name}” from your account?`)) return;
    setDeletingId(record.id);
    try {
      await deleteBiodata(record.id);
      await load(page);
    } catch (err) {
      setError(
        err instanceof ApiClientError || err instanceof Error
          ? err.message
          : 'Could not delete biodata',
      );
    } finally {
      setDeletingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="landing">
      <SiteHeader variant="app" />
      <section className="md-head">
        <div className="wrap">
          <div>
            <h1>My Designs</h1>
            <p>Biodatas you have saved</p>
          </div>
          <Link className="btn btn-primary" href="/?new=1">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M10 4v12M4 10h12" />
            </svg>
            New biodata
          </Link>
        </div>
      </section>

      <main id="main" className="wrap">
        {loading ? <p className="note" style={{ padding: '24px 0' }}>Loading your designs…</p> : null}
        {error ? (
          <p className="err" style={{ padding: '16px 0' }} role="alert">
            {error}
          </p>
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <div className="md-empty" id="empty">
            <OrnamentDivLotus />
            <h2 style={{ fontSize: '1.8rem' }}>No biodatas yet</h2>
            <p style={{ color: 'var(--ink-2)' }}>
              Create your first biodata. It takes a few minutes, and it is saved to your account.
            </p>
            <Link className="btn btn-primary" href="/?new=1">
              Create my biodata
            </Link>
          </div>
        ) : null}

        {items.length > 0 ? (
          <div className="md-grid">
            {items.map((record) => {
              const name = designDisplayName(record);
              const slug = recordSlug(record);
              const content = mergeSectionsIntoContent(
                normalizeContent(record.content, slug),
                record.editorSections,
              );
              return (
                <article key={record.id} className="md-card">
                  <Link
                    href={`/?id=${record.id}&design=${encodeURIComponent(slug)}`}
                    aria-label={`Open ${name}`}
                    onClick={(e) => {
                      e.preventDefault();
                      void openDesign(record);
                    }}
                  >
                    <MyDesignThumb
                      content={content}
                      sections={record.editorSections}
                      slug={slug}
                    />
                  </Link>
                  <h3>{name}</h3>
                  <div className="meta">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <rect x="3" y="4" width="14" height="13" rx="2" />
                      <path d="M3 8h14M7 2v4M13 2v4" />
                    </svg>
                    Updated {formatDate(record.updatedAt)}
                  </div>
                  <div className="acts">
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      disabled={openingId === record.id}
                      onClick={() => void openDesign(record)}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M2 5h6l2 2h8v9H2z" />
                      </svg>
                      {openingId === record.id ? 'Opening…' : 'Open'}
                    </button>
                    <button
                      className="btn btn-line btn-sm del"
                      type="button"
                      aria-label={`Delete ${name}`}
                      disabled={deletingId === record.id}
                      onClick={() => void onDelete(record)}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        aria-hidden
                      >
                        <path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11" />
                      </svg>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}

        {totalPages > 1 ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, paddingBottom: 32 }}>
            <button
              type="button"
              className="btn btn-line btn-sm"
              disabled={page <= 1 || loading}
              onClick={() => void load(page - 1)}
            >
              Previous
            </button>
            <span className="note">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-line btn-sm"
              disabled={page >= totalPages || loading}
              onClick={() => void load(page + 1)}
            >
              Next
            </button>
          </div>
        ) : null}
      </main>
      <SiteFooter slim />
    </div>
  );
}
