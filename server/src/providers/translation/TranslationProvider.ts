import type { LanguageCode, StructuredFields } from '@marriage/shared';

export interface TranslateStructuredInput {
  fields: StructuredFields;
  targetLanguage: LanguageCode;
  sourceLanguage?: LanguageCode;
}

export interface TranslationProvider {
  readonly name: string;
  translateStructured(input: TranslateStructuredInput): Promise<StructuredFields>;
}
