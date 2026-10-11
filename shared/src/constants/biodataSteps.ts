import { BiodataFormStep } from '../enums/BiodataFormStep';

/** Language is chosen on the download page, not in the wizard. */
export const BIODATA_STEP_ORDER: BiodataFormStep[] = [
  BiodataFormStep.PERSONAL,
  BiodataFormStep.EDUCATION_CAREER,
  BiodataFormStep.FAMILY,
  BiodataFormStep.ABOUT,
  BiodataFormStep.CONTACT,
  BiodataFormStep.PHOTO,
  BiodataFormStep.TEMPLATE,
  BiodataFormStep.PREVIEW,
];

export const BIODATA_STEP_LABELS: Record<BiodataFormStep, string> = {
  [BiodataFormStep.PERSONAL]: 'Basic details',
  [BiodataFormStep.EDUCATION_CAREER]: 'Education & career',
  [BiodataFormStep.FAMILY]: 'Family',
  [BiodataFormStep.ABOUT]: 'About',
  [BiodataFormStep.CONTACT]: 'Contact',
  [BiodataFormStep.PHOTO]: 'Photo',
  [BiodataFormStep.TEMPLATE]: 'Template',
  [BiodataFormStep.LANGUAGE]: 'Language',
  [BiodataFormStep.PREVIEW]: 'Preview',
};
