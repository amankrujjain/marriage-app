import type { StructuredFields } from '@marriage/shared';
import type {
  TranslateStructuredInput,
  TranslationProvider,
} from './TranslationProvider';
import { OFFLINE_GLOSSARY } from './dictionaryMaps';

/**
 * Offline glossary fallback — translates known values, leaves others as-is.
 * Used when AI_API_KEY is not configured.
 */
export class DictionaryTranslationProvider implements TranslationProvider {
  readonly name = 'dictionary';

  async translateStructured(
    input: TranslateStructuredInput,
  ): Promise<StructuredFields> {
    const glossary = OFFLINE_GLOSSARY[input.targetLanguage] ?? {};
    const result: StructuredFields = {};

    for (const [key, value] of Object.entries(input.fields)) {
      result[key] = glossary[value] ?? value;
    }

    return result;
  }
}
