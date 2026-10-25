'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  fetchAdminDesigns,
  updateAdminDesign,
  type DesignCatalogItem,
} from '@/features/designs/services/designsApi';
import { designsReady } from '@/features/designs/store/designsSlice';
import { useAppDispatch } from '@/store/hooks';
import {
  GALLERY_TEMPLATES,
  type GalleryFaith,
  type GalleryTemplate,
} from '@/features/templates/gallery/galleryCatalog';
import { TemplatePreviewModal } from '@/features/templates/gallery/TemplatePreviewModal';
import { TemplateId } from '@marriage/shared';

const CATS: DesignCatalogItem['cat'][] = ['Traditional', 'Royal', 'Floral', 'Modern'];
const TIERS: DesignCatalogItem['tier'][] = ['Free', 'Premium'];
const COMMUNITIES: GalleryFaith[] = ['Hindu', 'Muslim', 'Sikh', 'Christian'];

function toGalleryTemplate(item: DesignCatalogItem): GalleryTemplate {
  const base = GALLERY_TEMPLATES.find((t) => t.slug === item.slug);
  return {
    slug: item.slug,
    name: item.name,
    tier: item.tier,
    cat: item.cat,
    faith: item.faith as GalleryFaith[],
    blurb: item.blurb || base?.blurb || '',
    templateId: base?.templateId ?? TemplateId.TRADITIONAL_MAROON,
  };
}

export function AdminTemplatesPage() {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<DesignCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'Free' | 'Premium'>('all');
  const [communityFilter, setCommunityFilter] = useState<'all' | GalleryFaith>('all');
  const [preview, setPreview] = useState<GalleryTemplate | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await fetchAdminDesigns();
        if (!cancelled) {
          setItems(rows);
          dispatch(designsReady(rows.filter((r) => r.active)));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load templates');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((t) => {
      if (statusFilter === 'active' && !t.active) return false;
      if (statusFilter === 'inactive' && t.active) return false;
      if (tierFilter !== 'all' && t.tier !== tierFilter) return false;
      if (communityFilter !== 'all' && !t.faith.includes(communityFilter)) return false;
      if (!needle) return true;
      return (
        t.name.toLowerCase().includes(needle) ||
        t.slug.toLowerCase().includes(needle) ||
        t.cat.toLowerCase().includes(needle) ||
        t.faith.some((f) => f.toLowerCase().includes(needle))
      );
    });
  }, [items, q, statusFilter, tierFilter, communityFilter]);

  async function patch(slug: string, body: Partial<DesignCatalogItem>) {
    setSaving(slug);
    setError(null);
    try {
      const updated = await updateAdminDesign(slug, body);
      setItems((prev) => {
        const next = prev.map((t) => (t.slug === slug ? updated : t));
        dispatch(designsReady(next.filter((r) => r.active)));
        return next;
      });
      setPreview((prev) =>
        prev?.slug === slug ? toGalleryTemplate(updated) : prev,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(null);
    }
  }

  function toggleCommunity(item: DesignCatalogItem, faith: GalleryFaith) {
    const has = item.faith.includes(faith);
    const next = has
      ? item.faith.filter((f) => f !== faith)
      : [...item.faith, faith];
    if (!next.length) return;
    void patch(item.slug, { faith: next });
  }

  return (
    <div className="admin-view">
      <div className="admin-view-head">
        <div>
          <h1>Templates</h1>
          <p>
            Edit category, community, Free/Premium, and active status. Preview any design before
            publishing.
          </p>
        </div>
        <p className="admin-muted">
          {items.filter((t) => t.active).length} active · {items.length} total
        </p>
      </div>

      <form
        className="admin-filters"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label className="admin-filter-grow">
          <span>Search</span>
          <input
            type="search"
            placeholder="Name, slug, community…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label>
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <label>
          <span>Tier</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as typeof tierFilter)}
          >
            <option value="all">All</option>
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
          </select>
        </label>
        <label>
          <span>Community</span>
          <select
            value={communityFilter}
            onChange={(e) => setCommunityFilter(e.target.value as typeof communityFilter)}
          >
            <option value="all">All</option>
            {COMMUNITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </form>

      {loading ? <p className="admin-muted">Loading templates…</p> : null}
      {error ? (
        <p className="err" role="alert">
          {error}
        </p>
      ) : null}

      <section className="admin-card admin-table-card">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Template</th>
                <th>Category</th>
                <th>Tier</th>
                <th>Community</th>
                <th>Active</th>
                <th>Preview</th>
              </tr>
            </thead>
            <tbody>
              {!filtered.length ? (
                <tr>
                  <td colSpan={6} className="admin-muted">
                    No templates match.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const busy = saving === t.slug;
                  return (
                    <tr key={t.slug} className={t.active ? '' : 'dim'}>
                      <td>
                        <div className="admin-user-cell">
                          <strong>{t.name}</strong>
                          <span className="mono">{t.slug}</span>
                        </div>
                      </td>
                      <td>
                        <select
                          className="admin-inline-select"
                          value={t.cat}
                          disabled={busy}
                          onChange={(e) =>
                            void patch(t.slug, {
                              cat: e.target.value as DesignCatalogItem['cat'],
                            })
                          }
                        >
                          {CATS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="admin-inline-select"
                          value={t.tier}
                          disabled={busy}
                          onChange={(e) =>
                            void patch(t.slug, {
                              tier: e.target.value as DesignCatalogItem['tier'],
                            })
                          }
                        >
                          {TIERS.map((tier) => (
                            <option key={tier} value={tier}>
                              {tier}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="admin-faith-checks">
                          {COMMUNITIES.map((c) => (
                            <label key={c}>
                              <input
                                type="checkbox"
                                checked={t.faith.includes(c)}
                                disabled={busy || (t.faith.length === 1 && t.faith.includes(c))}
                                onChange={() => toggleCommunity(t, c)}
                              />
                              {c}
                            </label>
                          ))}
                        </div>
                      </td>
                      <td>
                        <label className="admin-switch">
                          <input
                            type="checkbox"
                            checked={t.active}
                            disabled={busy}
                            onChange={(e) =>
                              void patch(t.slug, { active: e.target.checked })
                            }
                          />
                          <span>{t.active ? 'Active' : 'Inactive'}</span>
                        </label>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setPreview(toGalleryTemplate(t))}
                        >
                          Preview
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <TemplatePreviewModal template={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
