'use client';

import { useCallback, useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { GALLERY_TEMPLATES, type GalleryTemplate } from '@/features/templates/gallery/galleryCatalog';
import type { EditorDesign } from '@/features/biodata/components/editor/designMap';
import { TemplateId } from '@marriage/shared';

const TEMPLATE_ID_BY_SLUG = new Map(
  GALLERY_TEMPLATES.map((t) => [t.slug, t.templateId] as const),
);

function templateIdFor(slug: string, cat: string): TemplateId {
  return (
    TEMPLATE_ID_BY_SLUG.get(slug) ??
    (cat === 'Royal'
      ? TemplateId.ROYAL_GOLD
      : cat === 'Floral'
        ? TemplateId.FLORAL_SOFT
        : cat === 'Modern'
          ? TemplateId.MODERN_CLEAN
          : TemplateId.TRADITIONAL_MAROON)
  );
}

export function useDesignCatalog() {
  const items = useAppSelector((s) => s.designs.items);
  const status = useAppSelector((s) => s.designs.status);

  const activeGallery = useMemo((): GalleryTemplate[] => {
    return items
      .filter((d) => d.active)
      .map((d) => ({
        slug: d.slug,
        name: d.name,
        tier: d.tier,
        cat: d.cat,
        faith: d.faith as GalleryTemplate['faith'],
        blurb: d.blurb,
        templateId: templateIdFor(d.slug, d.cat),
      }));
  }, [items]);

  const editorDesigns = useMemo((): EditorDesign[] => {
    return activeGallery.map((t) => {
      const shortName = t.name.split(' ')[0] ?? t.name;
      return {
        slug: t.slug,
        key: shortName.toLowerCase(),
        shortName,
        name: t.name,
        tier: t.tier,
        templateId: t.templateId,
      };
    });
  }, [activeGallery]);

  const bySlug = useMemo(() => {
    const map = new Map(items.map((d) => [d.slug, d]));
    return map;
  }, [items]);

  const isFreeDesign = useCallback(
    (slug: string): boolean => {
      const row = bySlug.get(slug);
      if (row) return row.tier === 'Free';
      return GALLERY_TEMPLATES.find((t) => t.slug === slug)?.tier === 'Free';
    },
    [bySlug],
  );

  const designFromSlug = useCallback(
    (slug: string | null | undefined): EditorDesign | null => {
      if (!slug) return null;
      return editorDesigns.find((d) => d.slug === slug) ?? null;
    },
    [editorDesigns],
  );

  return {
    status,
    items,
    activeGallery,
    editorDesigns,
    isFreeDesign,
    designFromSlug,
  };
}
