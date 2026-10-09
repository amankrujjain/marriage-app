import type {
  AboutDetails,
  CareerDetails,
  ContactDetails,
  EducationDetails,
  FamilyDetails,
  PersonalDetails,
} from './biodataSections';

export interface BiodataContent {
  personal: PersonalDetails;
  education: EducationDetails;
  career: CareerDetails;
  family: FamilyDetails;
  about: AboutDetails;
  contact: ContactDetails;
  profilePhotoUrl?: string;
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
