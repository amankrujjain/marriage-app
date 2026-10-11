import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TemplateId } from '@marriage/shared';

const DEFAULT_SLUG_BY_TEMPLATE: Partial<Record<TemplateId, string>> = {
  [TemplateId.TRADITIONAL_MAROON]: 'zari-traditional',
  [TemplateId.ROYAL_GOLD]: 'panna-royal',
  [TemplateId.FLORAL_SOFT]: 'gulab-floral',
  [TemplateId.MODERN_CLEAN]: 'kagaz-modern',
  [TemplateId.ELEGANT_SERIF]: 'suryavanshi-royal',
  [TemplateId.MINIMAL_LINE]: 'aarohi-modern',
};

interface TemplateState {
  selectedTemplateId: TemplateId;
  /** ui-v1 gallery slug for the VP renderer (8 designs). */
  selectedDesignSlug: string;
}

const initialState: TemplateState = {
  selectedTemplateId: TemplateId.TRADITIONAL_MAROON,
  selectedDesignSlug: 'zari-traditional',
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    selectTemplate(state, action: PayloadAction<TemplateId>) {
      state.selectedTemplateId = action.payload;
      state.selectedDesignSlug =
        DEFAULT_SLUG_BY_TEMPLATE[action.payload] ?? state.selectedDesignSlug;
    },
    selectDesign(
      state,
      action: PayloadAction<{ templateId: TemplateId; slug: string }>,
    ) {
      state.selectedTemplateId = action.payload.templateId;
      state.selectedDesignSlug = action.payload.slug;
    },
  },
});

export const { selectTemplate, selectDesign } = templateSlice.actions;
export const templateReducer = templateSlice.reducer;
