import type {
  AboutDetails,
  CareerDetails,
  ContactDetails,
  EducationDetails,
  FamilyDetails,
  PersonalDetails,
} from './biodataSections';
import type { BiodataEditorSection } from './biodataEditor';

/** How the profile photo is framed in the biodata photo slot (4:5). */
export interface ProfilePhotoFit {
  /** Horizontal focal point 0–100 (center of interest). */
  x: number;
  /** Vertical focal point 0–100. ~42 keeps heads inside oval frames. */
  y: number;
  /** Zoom 1–2.5 */
  zoom: number;
}

export const DEFAULT_PROFILE_PHOTO_FIT: ProfilePhotoFit = {
  x: 50,
  y: 42,
  zoom: 1,
};

export const DEFAULT_BIODATA_TAGLINE = 'A bond of love, respect and tradition.';
export const DEFAULT_BIODATA_HEADER = '॥ शुभ विवाह ॥';
export const DEFAULT_BIODATA_TITLE = 'Marriage Biodata';
export const DEFAULT_BIODATA_BLESSING =
  '॥ Wishing you a blessed and joyful journey together ॥';

export interface BiodataContent {
  personal: PersonalDetails;
  education: EducationDetails;
  career: CareerDetails;
  family: FamilyDetails;
  about: AboutDetails;
  contact: ContactDetails;
  profilePhotoUrl?: string;
  profilePhotoFit?: ProfilePhotoFit;
  /** Header blessing line above the title (e.g. ॥ शुभ विवाह ॥). */
  headerLine?: string;
  /** Main document title (e.g. Marriage Biodata). */
  documentTitle?: string;
  /** Tagline under the ornament. */
  tagline?: string;
  /** Footer blessing line. */
  blessing?: string;
  /** VP / gallery design slug last used (e.g. zari-traditional, panna-royal). */
  designSlug?: string;
  /** Dot-path field keys excluded from final biodata, e.g. "personal.caste" */
  hiddenFields: string[];
}

export interface BiodataRecord {
  id: string;
  userId: string;
  title: string;
  content: BiodataContent;
  /** Gallery / VP design slug for this saved biodata. */
  designSlug?: string;
  /** Full editor accordion layout + values for this biodata. */
  editorSections?: BiodataEditorSection[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBiodataPayload {
  title?: string;
  content: BiodataContent;
  designSlug?: string;
  editorSections?: BiodataEditorSection[];
}

export interface UpdateBiodataPayload {
  title?: string;
  content?: BiodataContent;
  designSlug?: string;
  editorSections?: BiodataEditorSection[];
}

export function emptyBiodataContent(): BiodataContent {
  return {
    personal: {},
    education: {},
    career: {},
    family: {},
    about: {},
    contact: {},
    hiddenFields: [],
  };
}
