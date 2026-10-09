import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TemplateId } from '@marriage/shared';

interface TemplateState {
  selectedTemplateId: TemplateId;
}

const initialState: TemplateState = {
  selectedTemplateId: TemplateId.TRADITIONAL_MAROON,
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    selectTemplate(state, action: PayloadAction<TemplateId>) {
      state.selectedTemplateId = action.payload;
    },
  },
});

export const { selectTemplate } = templateSlice.actions;
export const templateReducer = templateSlice.reducer;
