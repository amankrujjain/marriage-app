import { CachedTranslationProvider } from './CachedTranslationProvider';
import { DictionaryTranslationProvider } from './DictionaryTranslationProvider';
import { OpenAiTranslationProvider } from './OpenAiTranslationProvider';
import type { TranslationProvider } from './TranslationProvider';

let singleton: CachedTranslationProvider | null = null;

export function createTranslationProvider(): CachedTranslationProvider {
  if (singleton) return singleton;

  const apiKey = process.env.AI_API_KEY ?? '';
  const providerName = (process.env.AI_PROVIDER ?? 'openai').toLowerCase();

  let inner: TranslationProvider;
  if (apiKey && providerName === 'openai') {
    inner = new OpenAiTranslationProvider(apiKey);
  } else {
    inner = new DictionaryTranslationProvider();
  }

  singleton = new CachedTranslationProvider(inner);
  return singleton;
}
