import {
  applyTranslatedFields,
  flattenBiodataFields,
  type BiodataContent,
  type LanguageCode,
  type StructuredFields,
  type TranslateBiodataResponse,
  type TranslateResponse,
} from '@marriage/shared';
import { createTranslationProvider } from '../../providers/translation/createTranslationProvider';
import { PassthroughTranslationProvider } from '../../providers/translation/PassthroughTranslationProvider';

export async function translateStructuredFields(input: {
  fields: StructuredFields;
  targetLanguage: LanguageCode;
  sourceLanguage?: LanguageCode;
}): Promise<TranslateResponse> {
  if (
    Object.keys(input.fields).length === 0 ||
    (input.sourceLanguage && input.targetLanguage === input.sourceLanguage)
  ) {
    const passthrough = new PassthroughTranslationProvider();
    return {
      fields: await passthrough.translateStructured(input),
      targetLanguage: input.targetLanguage,
      cached: false,
      provider: passthrough.name,
    };
  }

  const provider = createTranslationProvider();
  const alreadyCached = provider.wasCached(input);
  const fields = await provider.translateStructured(input);

  return {
    fields,
    targetLanguage: input.targetLanguage,
    cached: alreadyCached,
    provider: provider.getInnerName(),
  };
}

export async function translateBiodataContent(input: {
  content: BiodataContent;
  targetLanguage: LanguageCode;
  sourceLanguage?: LanguageCode;
}): Promise<TranslateBiodataResponse> {
  const flat = flattenBiodataFields(input.content);
  const translated = await translateStructuredFields({
    fields: flat,
    targetLanguage: input.targetLanguage,
    sourceLanguage: input.sourceLanguage,
  });

  return {
    content: applyTranslatedFields(input.content, translated.fields),
    targetLanguage: translated.targetLanguage,
    cached: translated.cached,
    provider: translated.provider,
  };
}
