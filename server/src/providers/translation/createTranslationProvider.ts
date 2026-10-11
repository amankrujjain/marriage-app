import { CachedTranslationProvider } from './CachedTranslationProvider';
import { DictionaryTranslationProvider } from './DictionaryTranslationProvider';
import { OpenAiTranslationProvider } from './OpenAiTranslationProvider';
import type { TranslationProvider } from './TranslationProvider';

let singleton: CachedTranslationProvider | null = null;

export function createTranslationProvider(): CachedTranslationProvider {
  if (singleton) return singleton;

  const apiKey = process.env.AI_API_KEY ?? '';
  const providerName = (process.env.AI_PROVIDER ?? 'openai').toLowerCase();
  const model = process.env.AI_MODEL?.trim() || 'gpt-4o-mini';

  let inner: TranslationProvider;
  if (apiKey && providerName === 'openai') {
    inner = new OpenAiTranslationProvider(apiKey, model);
  } else {
    inner = new DictionaryTranslationProvider();
  }

  singleton = new CachedTranslationProvider(inner);
  return singleton;
}

/** Test helper — clears the singleton so env changes can be picked up. */
export function resetTranslationProviderForTests(): void {
  singleton = null;
}
