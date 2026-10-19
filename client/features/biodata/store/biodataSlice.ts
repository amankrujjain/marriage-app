import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  BiodataFormStep,
  DEFAULT_PROFILE_PHOTO_FIT,
  emptyBiodataContent,
  type BiodataContent,
  type BiodataEditorSection,
  type PersonalDetails,
  type EducationDetails,
  type CareerDetails,
  type FamilyDetails,
  type AboutDetails,
  type ContactDetails,
  type ProfilePhotoFit,
} from '@marriage/shared';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface BiodataState {
  biodataId: string | null;
  title: string;
  content: BiodataContent;
  designSlug: string | null;
  editorSections: BiodataEditorSection[] | null;
  step: BiodataFormStep;
  saveStatus: SaveStatus;
  saveError: string | null;
}

const initialState: BiodataState = {
  biodataId: null,
  title: '',
  content: emptyBiodataContent(),
  designSlug: null,
  editorSections: null,
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
    setDesignSlug(state, action: PayloadAction<string | null>) {
      state.designSlug = action.payload;
      if (action.payload) {
        state.content.designSlug = action.payload;
      } else {
        delete state.content.designSlug;
      }
    },
    setEditorSections(state, action: PayloadAction<BiodataEditorSection[]>) {
      state.editorSections = action.payload;
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
    patchPresentation(
      state,
      action: PayloadAction<
        Partial<
          Pick<BiodataContent, 'headerLine' | 'documentTitle' | 'tagline' | 'blessing'>
        >
      >,
    ) {
      const next = action.payload;
      if (next.headerLine !== undefined) state.content.headerLine = next.headerLine;
      if (next.documentTitle !== undefined) state.content.documentTitle = next.documentTitle;
      if (next.tagline !== undefined) state.content.tagline = next.tagline;
      if (next.blessing !== undefined) state.content.blessing = next.blessing;
    },
    setProfilePhotoUrl(state, action: PayloadAction<string | undefined>) {
      state.content.profilePhotoUrl = action.payload;
      if (action.payload) {
        state.content.profilePhotoFit = { ...DEFAULT_PROFILE_PHOTO_FIT };
      } else {
        delete state.content.profilePhotoFit;
      }
    },
    setProfilePhotoFit(state, action: PayloadAction<ProfilePhotoFit>) {
      state.content.profilePhotoFit = action.payload;
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
      action: PayloadAction<{
        id: string;
        title: string;
        content: BiodataContent;
        designSlug?: string;
        editorSections?: BiodataEditorSection[];
      }>,
    ) {
      state.biodataId = action.payload.id;
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.designSlug =
        action.payload.designSlug || action.payload.content.designSlug || null;
      state.editorSections = action.payload.editorSections ?? null;
      state.saveStatus = 'saved';
    },
    resetBiodataDraft() {
      return initialState;
    },
  },
});

export const {
  setStep,
  setTitle,
  setDesignSlug,
  setEditorSections,
  patchPersonal,
  patchEducation,
  patchCareer,
  patchFamily,
  patchAbout,
  patchContact,
  patchPresentation,
  setProfilePhotoUrl,
  setProfilePhotoFit,
  toggleHiddenField,
  saveStarted,
  saveSucceeded,
  saveFailed,
  loadBiodata,
  resetBiodataDraft,
} = biodataSlice.actions;
export const biodataReducer = biodataSlice.reducer;
