import { apiGet, apiPatch } from '@/lib/apiClient';

export type DesignCatalogItem = {
  slug: string;
  name: string;
  tier: 'Free' | 'Premium';
  cat: 'Traditional' | 'Royal' | 'Floral' | 'Modern';
  faith: string[];
  blurb: string;
  active: boolean;
  updatedAt?: string | null;
};

export async function fetchPublicDesigns(): Promise<DesignCatalogItem[]> {
  const data = await apiGet<{ items: DesignCatalogItem[] }>('/designs');
  return data.items;
}

export async function fetchAdminDesigns(): Promise<DesignCatalogItem[]> {
  const data = await apiGet<{ items: DesignCatalogItem[] }>('/admin/templates');
  return data.items;
}

export async function updateAdminDesign(
  slug: string,
  patch: Partial<Pick<DesignCatalogItem, 'tier' | 'cat' | 'active' | 'name' | 'blurb' | 'faith'>>,
): Promise<DesignCatalogItem> {
  return apiPatch<DesignCatalogItem>(`/admin/templates/${encodeURIComponent(slug)}`, patch);
}
