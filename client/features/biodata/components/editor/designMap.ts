import { TemplateId } from '@marriage/shared';

export type EditorDesignKey = 'zari' | 'panna' | 'genda' | 'kagaz';

export const EDITOR_DESIGNS: Array<{
  key: EditorDesignKey;
  name: string;
  templateId: TemplateId;
}> = [
  { key: 'zari', name: 'Zari', templateId: TemplateId.TRADITIONAL_MAROON },
  { key: 'panna', name: 'Panna', templateId: TemplateId.ROYAL_GOLD },
  { key: 'genda', name: 'Genda', templateId: TemplateId.FLORAL_SOFT },
  { key: 'kagaz', name: 'Kagaz', templateId: TemplateId.MODERN_CLEAN },
];

export function designKeyFromTemplate(id: TemplateId): EditorDesignKey {
  const found = EDITOR_DESIGNS.find((d) => d.templateId === id);
  return found?.key ?? 'zari';
}

export function templateFromDesignQuery(design: string | null): TemplateId | null {
  if (!design) return null;
  const byKey = EDITOR_DESIGNS.find((d) => d.key === design || design.startsWith(d.key));
  if (byKey) return byKey.templateId;
  const galleryMap: Record<string, TemplateId> = {
    'zari-do-patra': TemplateId.TRADITIONAL_MAROON,
    'panna-sada': TemplateId.ROYAL_GOLD,
    gulab: TemplateId.FLORAL_SOFT,
    neelkanth: TemplateId.ROYAL_GOLD,
    khalsa: TemplateId.TRADITIONAL_MAROON,
    'kagaz-bina-photo': TemplateId.MODERN_CLEAN,
    slate: TemplateId.MODERN_CLEAN,
    jinvani: TemplateId.FLORAL_SOFT,
  };
  return galleryMap[design] ?? null;
}
