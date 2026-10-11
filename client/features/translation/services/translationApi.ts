import type {
  BiodataContent,
  LanguageCode,
  StructuredFields,
  TranslateBiodataResponse,
  TranslateResponse,
} from '@marriage/shared';
import { apiPost } from '@/lib/apiClient';

export async function translateBiodata(input: {
  content: BiodataContent;
  targetLanguage: LanguageCode;
  sourceLanguage?: LanguageCode;
}): Promise<TranslateBiodataResponse> {
  return apiPost<TranslateBiodataResponse>('/translation/translate-biodata', input);
}

export async function translateFields(input: {
  fields: StructuredFields;
  targetLanguage: LanguageCode;
  sourceLanguage?: LanguageCode;
}): Promise<TranslateResponse> {
  return apiPost<TranslateResponse>('/translation/translate', input);
}
