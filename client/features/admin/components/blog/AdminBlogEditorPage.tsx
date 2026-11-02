'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BlogPostStatus,
  type AdminBlogPost,
  type BlogSeoScoreResult,
  type CreateBlogPostPayload,
} from '@marriage/shared';
import {
  createAdminBlogPost,
  deleteAdminBlogPost,
  getAdminBlogPost,
  publishAdminBlogPost,
  removeAdminBlogCover,
  scheduleAdminBlogPost,
  scoreAdminBlogPost,
  setAdminBlogCover,
  unpublishAdminBlogPost,
  updateAdminBlogPost,
} from '@/features/admin/services/adminApi';
import { BlogRichEditor } from './BlogRichEditor';
import { BlogSeoPanel } from './BlogSeoPanel';
import {
  fromIstLocalInput,
  slugifyTitle,
  tagsFromInput,
  toIstLocalInput,
} from './slugifyTitle';

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  contentJson: unknown;
  coverImageUrl: string | null;
  coverAlt: string;
  tagsInput: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  featured: boolean;
  noindex: boolean;
  scheduleLocal: string;
};

function emptyForm(): FormState {
  return {
    title: '',
    slug: '',
    excerpt: '',
    contentHtml: '',
    contentJson: null,
    coverImageUrl: null,
    coverAlt: '',
    tagsInput: '',
    category: '',
    seoTitle: '',
    seoDescription: '',
    focusKeyword: '',
    featured: false,
    noindex: false,
    scheduleLocal: '',
  };
}

function formFromPost(post: AdminBlogPost): FormState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    contentHtml: post.contentHtml,
    contentJson: post.contentJson,
    coverImageUrl: post.coverImageUrl,
    coverAlt: post.coverAlt,
    tagsInput: post.tags.join(', '),
    category: post.category,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    focusKeyword: post.focusKeyword,
    featured: post.featured,
    noindex: post.noindex,
    scheduleLocal: toIstLocalInput(post.publishAt),
  };
}

function snapshot(form: FormState): string {
  return JSON.stringify(form);
}

function toPayload(form: FormState): CreateBlogPostPayload {
  return {
    title: form.title.trim(),
    slug: form.slug.trim() || undefined,
    excerpt: form.excerpt,
    contentHtml: form.contentHtml,
    contentJson: form.contentJson ?? undefined,
    coverImageUrl: form.coverImageUrl,
    coverAlt: form.coverAlt,
    tags: tagsFromInput(form.tagsInput),
    category: form.category,
    seoTitle: form.seoTitle,
    seoDescription: form.seoDescription,
    focusKeyword: form.focusKeyword,
    featured: form.featured,
    noindex: form.noindex,
  };
}

export function AdminBlogEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isNew = rawId === 'new';

  const [postId, setPostId] = useState<string | null>(isNew ? null : rawId);
  const [status, setStatus] = useState<BlogPostStatus>(BlogPostStatus.DRAFT);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [seo, setSeo] = useState<BlogSeoScoreResult | null>(null);
  const [seoLoading, setSeoLoading] = useState(false);
  const cleanSnap = useRef(snapshot(emptyForm()));

  const dirty = useMemo(
    () => snapshot(form) !== cleanSnap.current,
    [form],
  );

  const patch = useCallback((partial: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  }, []);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const post = await getAdminBlogPost(rawId);
        if (cancelled) return;
        const next = formFromPost(post);
        setForm(next);
        setPostId(post.id);
        setStatus(post.status);
        setSlugTouched(true);
        cleanSnap.current = snapshot(next);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load post');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isNew, rawId]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (loading) return;
    const handle = window.setTimeout(() => {
      setSeoLoading(true);
      void scoreAdminBlogPost({
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        contentHtml: form.contentHtml,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        focusKeyword: form.focusKeyword,
        coverAlt: form.coverAlt,
      })
        .then((result) => setSeo(result))
        .catch(() => {
          /* ignore score errors while typing */
        })
        .finally(() => setSeoLoading(false));
    }, 400);
    return () => window.clearTimeout(handle);
  }, [
    loading,
    form.title,
    form.slug,
    form.excerpt,
    form.contentHtml,
    form.seoTitle,
    form.seoDescription,
    form.focusKeyword,
    form.coverAlt,
  ]);

  async function saveDraft(): Promise<AdminBlogPost | null> {
    if (!form.title.trim()) {
      setError('Title is required');
      return null;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = toPayload(form);
      let post: AdminBlogPost;
      if (!postId) {
        post = await createAdminBlogPost(payload);
        setPostId(post.id);
        router.replace(`/admin/blog/${post.id}/`);
      } else {
        post = await updateAdminBlogPost(postId, payload);
      }
      const next = formFromPost(post);
      setForm(next);
      setStatus(post.status);
      setSlugTouched(true);
      cleanSnap.current = snapshot(next);
      setMessage('Draft saved');
      return post;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function onPublish() {
    const saved = await saveDraft();
    if (!saved) return;
    setSaving(true);
    try {
      const post = await publishAdminBlogPost(saved.id);
      const next = formFromPost(post);
      setForm(next);
      setStatus(post.status);
      cleanSnap.current = snapshot(next);
      setMessage('Published');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish failed');
    } finally {
      setSaving(false);
    }
  }

  async function onUnpublish() {
    if (!postId) return;
    setSaving(true);
    setError(null);
    try {
      const post = await unpublishAdminBlogPost(postId);
      const next = formFromPost(post);
      setForm(next);
      setStatus(post.status);
      cleanSnap.current = snapshot(next);
      setMessage('Moved to draft');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unpublish failed');
    } finally {
      setSaving(false);
    }
  }

  async function onSchedule() {
    const saved = await saveDraft();
    if (!saved) return;
    setSaving(true);
    try {
      const publishAt = fromIstLocalInput(form.scheduleLocal);
      const post = await scheduleAdminBlogPost(saved.id, { publishAt });
      const next = formFromPost(post);
      setForm(next);
      setStatus(post.status);
      cleanSnap.current = snapshot(next);
      setMessage('Scheduled');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Schedule failed');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!postId) return;
    if (!window.confirm('Delete this post?')) return;
    setSaving(true);
    try {
      await deleteAdminBlogPost(postId);
      router.push('/admin/blog/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      setSaving(false);
    }
  }

  async function onCoverChange(file: File | null) {
    if (!file) return;
    let id = postId;
    if (!id) {
      const saved = await saveDraft();
      if (!saved) return;
      id = saved.id;
    }
    setSaving(true);
    setError(null);
    try {
      const post = await setAdminBlogCover(id, file);
      const next = formFromPost(post);
      setForm((prev) => ({
        ...next,
        scheduleLocal: prev.scheduleLocal,
      }));
      cleanSnap.current = snapshot({
        ...next,
        scheduleLocal: form.scheduleLocal,
      });
      setMessage('Cover updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cover upload failed');
    } finally {
      setSaving(false);
    }
  }

  async function onRemoveCover() {
    if (!postId) return;
    setSaving(true);
    try {
      const post = await removeAdminBlogCover(postId);
      const next = formFromPost(post);
      setForm((prev) => ({ ...next, scheduleLocal: prev.scheduleLocal }));
      setMessage('Cover removed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove cover');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="admin-muted">Loading post…</p>;
  }

  return (
    <div>
      <div className="admin-view-head">
        <div>
          <p className="admin-muted" style={{ marginBottom: 6 }}>
            <Link href="/admin/blog/">← Blog</Link>
          </p>
          <h1>{isNew && !postId ? 'New post' : 'Edit post'}</h1>
          <p>
            Status: <span className="admin-pill">{status}</span>
            {dirty ? ' · Unsaved changes' : null}
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? 'Hide preview' : 'Preview'}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={saving || !dirty}
            onClick={() => void saveDraft()}
          >
            Save draft
          </button>
          {status === BlogPostStatus.PUBLISHED ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={saving}
              onClick={() => void onUnpublish()}
            >
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={saving}
              onClick={() => void onPublish()}
            >
              Publish
            </button>
          )}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={saving || !form.scheduleLocal}
            onClick={() => void onSchedule()}
          >
            Schedule
          </button>
          {postId ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={saving}
              onClick={() => void onDelete()}
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="admin-muted" style={{ color: '#8a1c1c' }}>
          {error}
        </p>
      ) : null}
      {message ? <p className="admin-muted">{message}</p> : null}

      <div className="blog-editor-layout">
        <div className="blog-editor-main">
          <div className="admin-card">
            <label className="blog-field">
              Title
              <input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  patch({
                    title,
                    ...(slugTouched
                      ? {}
                      : { slug: slugifyTitle(title) }),
                  });
                }}
                maxLength={200}
              />
            </label>
            <label className="blog-field">
              Slug
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  patch({ slug: e.target.value });
                }}
                maxLength={200}
              />
            </label>
            <label className="blog-field">
              Excerpt
              <textarea
                value={form.excerpt}
                onChange={(e) => patch({ excerpt: e.target.value })}
                rows={3}
                maxLength={500}
              />
            </label>
            <div className="blog-field">
              <span>Body</span>
              <BlogRichEditor
                key={postId ?? 'new'}
                html={form.contentHtml}
                json={form.contentJson}
                disabled={saving}
                onChange={(contentHtml, contentJson) =>
                  patch({ contentHtml, contentJson })
                }
              />
            </div>
          </div>

          {showPreview ? (
            <div className="admin-card">
              <div className="admin-card-head">
                <h2>Preview</h2>
                <p>Sandboxed HTML (admin only)</p>
              </div>
              <article
                className="blog-preview-html"
                dangerouslySetInnerHTML={{ __html: form.contentHtml || '<p></p>' }}
              />
            </div>
          ) : null}
        </div>

        <aside className="blog-editor-side">
          <BlogSeoPanel result={seo} loading={seoLoading} />

          <div className="admin-card">
            <div className="admin-card-head">
              <h2>Cover</h2>
            </div>
            {form.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.coverImageUrl}
                alt={form.coverAlt || ''}
                className="blog-cover-preview"
              />
            ) : (
              <p className="admin-muted">No cover yet.</p>
            )}
            <label className="blog-field">
              Cover file
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  void onCoverChange(file);
                  e.target.value = '';
                }}
              />
            </label>
            {form.coverImageUrl ? (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => void onRemoveCover()}
              >
                Remove cover
              </button>
            ) : null}
            <label className="blog-field">
              Cover alt
              <input
                value={form.coverAlt}
                onChange={(e) => patch({ coverAlt: e.target.value })}
                maxLength={180}
              />
            </label>
          </div>

          <div className="admin-card">
            <div className="admin-card-head">
              <h2>Meta</h2>
            </div>
            <label className="blog-field">
              Tags (comma-separated)
              <input
                value={form.tagsInput}
                onChange={(e) => patch({ tagsInput: e.target.value })}
              />
            </label>
            <label className="blog-field">
              Category
              <input
                value={form.category}
                onChange={(e) => patch({ category: e.target.value })}
                maxLength={80}
              />
            </label>
            <label className="blog-field">
              SEO title
              <input
                value={form.seoTitle}
                onChange={(e) => patch({ seoTitle: e.target.value })}
                maxLength={120}
              />
            </label>
            <label className="blog-field">
              SEO description
              <textarea
                value={form.seoDescription}
                onChange={(e) => patch({ seoDescription: e.target.value })}
                rows={3}
                maxLength={300}
              />
            </label>
            <label className="blog-field">
              Focus keyword
              <input
                value={form.focusKeyword}
                onChange={(e) => patch({ focusKeyword: e.target.value })}
                maxLength={80}
              />
            </label>
            <label className="blog-field">
              Schedule (IST)
              <input
                type="datetime-local"
                value={form.scheduleLocal}
                onChange={(e) => patch({ scheduleLocal: e.target.value })}
              />
            </label>
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => patch({ featured: e.target.checked })}
              />
              Featured
            </label>
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={form.noindex}
                onChange={(e) => patch({ noindex: e.target.checked })}
              />
              noindex
            </label>
          </div>
        </aside>
      </div>
    </div>
  );
}
