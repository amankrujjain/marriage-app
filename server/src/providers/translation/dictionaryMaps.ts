import { LanguageCode } from '@marriage/shared';

/** Small offline glossary for demo when no AI key is configured. */
export const OFFLINE_GLOSSARY: Partial<
  Record<LanguageCode, Record<string, string>>
> = {
  [LanguageCode.HI]: {
    'Software Engineer': 'सॉफ्टवेयर इंजीनियर',
    Engineer: 'इंजीनियर',
    Hindu: 'हिन्दू',
    Male: 'पुरुष',
    Female: 'महिला',
    'Never married': 'अविवाहित',
    Business: 'व्यवसाय',
    Teacher: 'शिक्षक',
    Doctor: 'डॉक्टर',
  },
  [LanguageCode.MR]: {
    'Software Engineer': 'सॉफ्टवेअर अभियंता',
    Engineer: 'अभियंता',
    Hindu: 'हिंदू',
    Male: 'पुरुष',
    Female: 'स्त्री',
    Business: 'व्यवसाय',
  },
  [LanguageCode.BN]: {
    Engineer: 'প্রকৌশলী',
    Hindu: 'হিন্দু',
    Male: 'পুরুষ',
    Female: 'মহিলা',
  },
};
