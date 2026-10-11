import type {
  AboutDetails,
  CareerDetails,
  ContactDetails,
  EducationDetails,
  FamilyDetails,
  PersonalDetails,
} from './biodataSections';

/** How the profile photo is framed in the 3:4 biodata slot. */
export interface ProfilePhotoFit {
  /** Horizontal focal point 0–100 (object-position x). */
  x: number;
  /** Vertical focal point 0–100 (object-position y). Lower = more headroom. */
  y: number;
  /** Zoom 1–2.5 */
  zoom: number;
}

export const DEFAULT_PROFILE_PHOTO_FIT: ProfilePhotoFit = {
  x: 50,
  y: 28,
  zoom: 1,
};

export interface BiodataContent {
  personal: PersonalDetails;
  education: EducationDetails;
  career: CareerDetails;
  family: FamilyDetails;
  about: AboutDetails;
  contact: ContactDetails;
  profilePhotoUrl?: string;
  profilePhotoFit?: ProfilePhotoFit;
  /** Dot-path field keys excluded from final biodata, e.g. "personal.caste" */
  hiddenFields: string[];
}

export interface BiodataRecord {
  id: string;
  userId: string;
  title: string;
  content: BiodataContent;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBiodataPayload {
  title?: string;
  content: BiodataContent;
}

export interface UpdateBiodataPayload {
  title?: string;
  content?: BiodataContent;
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
