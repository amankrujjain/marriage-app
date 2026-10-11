import { LanguageCode } from '../enums/LanguageCode';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

/** English first (download default), then the 22 scheduled languages A–Z by English name. */
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: LanguageCode.EN, name: 'English', nativeName: 'English' },
  { code: LanguageCode.AS, name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: LanguageCode.BN, name: 'Bengali', nativeName: 'বাংলা' },
  { code: LanguageCode.BRX, name: 'Bodo', nativeName: 'बरʼ' },
  { code: LanguageCode.DOI, name: 'Dogri', nativeName: 'डोगरी' },
  { code: LanguageCode.GU, name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: LanguageCode.HI, name: 'Hindi', nativeName: 'हिन्दी' },
  { code: LanguageCode.KN, name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: LanguageCode.KS, name: 'Kashmiri', nativeName: 'كٲشُر' },
  { code: LanguageCode.KOK, name: 'Konkani', nativeName: 'कोंकणी' },
  { code: LanguageCode.MAI, name: 'Maithili', nativeName: 'मैथिली' },
  { code: LanguageCode.ML, name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: LanguageCode.MNI, name: 'Manipuri', nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ' },
  { code: LanguageCode.MR, name: 'Marathi', nativeName: 'मराठी' },
  { code: LanguageCode.NE, name: 'Nepali', nativeName: 'नेपाली' },
  { code: LanguageCode.OR, name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: LanguageCode.PA, name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: LanguageCode.SA, name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  { code: LanguageCode.SAT, name: 'Santhali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: LanguageCode.SD, name: 'Sindhi', nativeName: 'سنڌي' },
  { code: LanguageCode.TA, name: 'Tamil', nativeName: 'தமிழ்' },
  { code: LanguageCode.TE, name: 'Telugu', nativeName: 'తెలుగు' },
  { code: LanguageCode.UR, name: 'Urdu', nativeName: 'اردو' },
];

/** All downloadable language codes (English + 22 scheduled). */
export const ALL_LANGUAGE_CODES: LanguageCode[] = LANGUAGE_OPTIONS.map(
  (option) => option.code,
);

/** Scheduled Indian languages only (excludes English). */
export const SCHEDULED_LANGUAGE_CODES: LanguageCode[] = LANGUAGE_OPTIONS.filter(
  (option) => option.code !== LanguageCode.EN,
).map((option) => option.code);

export function getLanguageOption(code: LanguageCode): LanguageOption | undefined {
  return LANGUAGE_OPTIONS.find((option) => option.code === code);
}
