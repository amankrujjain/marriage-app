import type { Gender } from '../enums/Gender';
import type { MaritalStatus } from '../enums/MaritalStatus';

export interface PersonalDetails {
  fullName?: string;
  gender?: Gender;
  dateOfBirth?: string;
  age?: number;
  height?: string;
  religion?: string;
  caste?: string;
  motherTongue?: string;
  maritalStatus?: MaritalStatus;
  location?: string;
}

export interface EducationDetails {
  highestEducation?: string;
  institution?: string;
  additionalEducation?: string;
}

export interface CareerDetails {
  profession?: string;
  company?: string;
  income?: string;
  workLocation?: string;
}

export interface FamilyDetails {
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  siblings?: string;
  familyLocation?: string;
}

export interface AboutDetails {
  aboutMe?: string;
  hobbies?: string;
  lifestyle?: string;
}

export interface ContactDetails {
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
}
