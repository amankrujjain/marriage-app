import type { LanguageCode } from '../enums/LanguageCode';
import type { BiodataContent } from './biodata';

/** Flat structured fields — same keys returned after translation. */
export type StructuredFields = Record<string, string>;

export interface TranslateRequest {
  fields: StructuredFields;
  targetLanguage: LanguageCode;
  sourceLanguage?: LanguageCode;
}

export interface TranslateResponse {
  fields: StructuredFields;
  targetLanguage: LanguageCode;
  cached: boolean;
  provider: string;
}

export interface TranslateBiodataRequest {
  content: BiodataContent;
  targetLanguage: LanguageCode;
  sourceLanguage?: LanguageCode;
}

export interface TranslateBiodataResponse {
  content: BiodataContent;
  targetLanguage: LanguageCode;
  cached: boolean;
  provider: string;
}
