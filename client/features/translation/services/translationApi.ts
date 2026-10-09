import type {
  BiodataContent,
  LanguageCode,
  TranslateBiodataResponse,
} from '@marriage/shared';
import { apiPost } from '@/lib/apiClient';

export async function translateBiodata(input: {
  content: BiodataContent;
  targetLanguage: LanguageCode;
  sourceLanguage?: LanguageCode;
}): Promise<TranslateBiodataResponse> {
  return apiPost<TranslateBiodataResponse>('/translation/translate-biodata', input);
}
