import { LanguageCode } from '../enums/LanguageCode';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: LanguageCode.EN, name: 'English', nativeName: 'English' },
  { code: LanguageCode.HI, name: 'Hindi', nativeName: 'हिन्दी' },
  { code: LanguageCode.BN, name: 'Bengali', nativeName: 'বাংলা' },
  { code: LanguageCode.MR, name: 'Marathi', nativeName: 'मराठी' },
  { code: LanguageCode.GU, name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: LanguageCode.PA, name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: LanguageCode.TA, name: 'Tamil', nativeName: 'தமிழ்' },
  { code: LanguageCode.TE, name: 'Telugu', nativeName: 'తెలుగు' },
  { code: LanguageCode.KN, name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];
