import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  BiodataFormStep,
  emptyBiodataContent,
  type BiodataContent,
  type PersonalDetails,
  type EducationDetails,
  type CareerDetails,
  type FamilyDetails,
  type AboutDetails,
  type ContactDetails,
} from '@marriage/shared';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface BiodataState {
  biodataId: string | null;
  title: string;
  content: BiodataContent;
  step: BiodataFormStep;
  saveStatus: SaveStatus;
  saveError: string | null;
}

const initialState: BiodataState = {
  biodataId: null,
  title: '',
  content: emptyBiodataContent(),
  step: BiodataFormStep.PERSONAL,
  saveStatus: 'idle',
  saveError: null,
};

const biodataSlice = createSlice({
  name: 'biodata',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<BiodataFormStep>) {
      state.step = action.payload;
    },
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    patchPersonal(state, action: PayloadAction<Partial<PersonalDetails>>) {
      state.content.personal = { ...state.content.personal, ...action.payload };
    },
    patchEducation(state, action: PayloadAction<Partial<EducationDetails>>) {
      state.content.education = { ...state.content.education, ...action.payload };
    },
    patchCareer(state, action: PayloadAction<Partial<CareerDetails>>) {
      state.content.career = { ...state.content.career, ...action.payload };
    },
    patchFamily(state, action: PayloadAction<Partial<FamilyDetails>>) {
      state.content.family = { ...state.content.family, ...action.payload };
    },
    patchAbout(state, action: PayloadAction<Partial<AboutDetails>>) {
      state.content.about = { ...state.content.about, ...action.payload };
    },
    patchContact(state, action: PayloadAction<Partial<ContactDetails>>) {
      state.content.contact = { ...state.content.contact, ...action.payload };
    },
    setProfilePhotoUrl(state, action: PayloadAction<string | undefined>) {
      state.content.profilePhotoUrl = action.payload;
    },
    toggleHiddenField(state, action: PayloadAction<string>) {
      const key = action.payload;
      const list = state.content.hiddenFields;
      state.content.hiddenFields = list.includes(key)
        ? list.filter((item) => item !== key)
        : [...list, key];
    },
    saveStarted(state) {
      state.saveStatus = 'saving';
      state.saveError = null;
    },
    saveSucceeded(state, action: PayloadAction<{ id: string; title: string }>) {
      state.biodataId = action.payload.id;
      state.title = action.payload.title;
      state.saveStatus = 'saved';
    },
    saveFailed(state, action: PayloadAction<string>) {
      state.saveStatus = 'error';
      state.saveError = action.payload;
    },
    loadBiodata(
      state,
      action: PayloadAction<{ id: string; title: string; content: BiodataContent }>,
    ) {
      state.biodataId = action.payload.id;
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.saveStatus = 'saved';
    },
    resetBiodataDraft() {
      return initialState;
    },
  },
});

export const {
  setStep, setTitle, patchPersonal, patchEducation, patchCareer, patchFamily,
  patchAbout, patchContact, setProfilePhotoUrl, toggleHiddenField, saveStarted,
  saveSucceeded, saveFailed, loadBiodata, resetBiodataDraft,
} = biodataSlice.actions;
export const biodataReducer = biodataSlice.reducer;
