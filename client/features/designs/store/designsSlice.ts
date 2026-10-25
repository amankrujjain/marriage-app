import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DesignCatalogItem } from '../services/designsApi';
import { GALLERY_TEMPLATES } from '@/features/templates/gallery/galleryCatalog';

export type DesignsStatus = 'idle' | 'loading' | 'ready' | 'error';

type DesignsState = {
  status: DesignsStatus;
  items: DesignCatalogItem[];
  error: string | null;
};

function fallbackItems(): DesignCatalogItem[] {
  return GALLERY_TEMPLATES.map((t) => ({
    slug: t.slug,
    name: t.name,
    tier: t.tier,
    cat: t.cat,
    faith: t.faith,
    blurb: t.blurb,
    active: true,
    updatedAt: null,
  }));
}

const initialState: DesignsState = {
  status: 'idle',
  items: fallbackItems(),
  error: null,
};

const designsSlice = createSlice({
  name: 'designs',
  initialState,
  reducers: {
    designsLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    designsReady(state, action: PayloadAction<DesignCatalogItem[]>) {
      state.status = 'ready';
      state.items = action.payload.length ? action.payload : fallbackItems();
      state.error = null;
    },
    designsFailed(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    designsPatched(state, action: PayloadAction<DesignCatalogItem>) {
      const idx = state.items.findIndex((d) => d.slug === action.payload.slug);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.push(action.payload);
    },
  },
});

export const { designsLoading, designsReady, designsFailed, designsPatched } =
  designsSlice.actions;
export const designsReducer = designsSlice.reducer;
