'use client';

import { BiodataFormStep } from '@marriage/shared';
import { useAppSelector } from '@/store/hooks';
import { PersonalStep } from './steps/PersonalStep';
import { EducationCareerStep } from './steps/EducationCareerStep';
import { FamilyStep } from './steps/FamilyStep';
import { AboutStep } from './steps/AboutStep';
import { ContactStep } from './steps/ContactStep';
import { PhotoStep } from './steps/PhotoStep';
import { TemplateStep } from './steps/TemplateStep';
import { LanguageStep } from './steps/LanguageStep';
import { PreviewStep } from './steps/PreviewStep';

export function StepRenderer() {
  const step = useAppSelector((state) => state.biodata.step);

  switch (step) {
    case BiodataFormStep.PERSONAL:
      return <PersonalStep />;
    case BiodataFormStep.EDUCATION_CAREER:
      return <EducationCareerStep />;
    case BiodataFormStep.FAMILY:
      return <FamilyStep />;
    case BiodataFormStep.ABOUT:
      return <AboutStep />;
    case BiodataFormStep.CONTACT:
      return <ContactStep />;
    case BiodataFormStep.PHOTO:
      return <PhotoStep />;
    case BiodataFormStep.TEMPLATE:
      return <TemplateStep />;
    case BiodataFormStep.LANGUAGE:
      return <LanguageStep />;
    case BiodataFormStep.PREVIEW:
      return <PreviewStep />;
    default:
      return <PersonalStep />;
  }
}
