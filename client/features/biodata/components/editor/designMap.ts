import { TemplateId } from '@marriage/shared';
import { GALLERY_TEMPLATES } from '@/features/templates/gallery/galleryCatalog';

export type EditorDesign = {
  slug: string;
  /** Short label used in the design strip (first word). */
  key: string;
  shortName: string;
  name: string;
  tier: 'Free' | 'Premium';
  templateId: TemplateId;
};

export const EDITOR_DESIGNS: EditorDesign[] = GALLERY_TEMPLATES.map((t) => {
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

export function slugFromTemplateId(id: TemplateId): string {
  const found = EDITOR_DESIGNS.find((d) => d.templateId === id);
  return found?.slug ?? 'zari-traditional';
}

export function designKeyFromTemplate(id: TemplateId): string {
  const found = EDITOR_DESIGNS.find((d) => d.templateId === id);
  return found?.key ?? 'zari';
}

export function designFromSlug(slug: string | null | undefined): EditorDesign | null {
  if (!slug) return null;
  return EDITOR_DESIGNS.find((d) => d.slug === slug) ?? null;
}

export function templateFromDesignQuery(design: string | null): {
  templateId: TemplateId;
  slug: string;
} | null {
  if (!design) return null;
  const bySlug = EDITOR_DESIGNS.find((d) => d.slug === design);
  if (bySlug) return { templateId: bySlug.templateId, slug: bySlug.slug };
  const lower = design.toLowerCase();
  const byKey = EDITOR_DESIGNS.find(
    (d) => d.key === lower || d.shortName.toLowerCase() === lower || design.startsWith(d.slug),
  );
  return byKey ? { templateId: byKey.templateId, slug: byKey.slug } : null;
}

export function isFreeDesign(slug: string): boolean {
  return EDITOR_DESIGNS.find((d) => d.slug === slug)?.tier === 'Free';
}
