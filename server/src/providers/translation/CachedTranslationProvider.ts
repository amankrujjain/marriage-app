import { createHash } from 'crypto';
import type { StructuredFields } from '@marriage/shared';
import type {
  TranslateStructuredInput,
  TranslationProvider,
} from './TranslationProvider';

interface CacheEntry {
  fields: StructuredFields;
  provider: string;
}

export class CachedTranslationProvider implements TranslationProvider {
  readonly name: string;
  private readonly cache = new Map<string, CacheEntry>();

  constructor(private readonly inner: TranslationProvider) {
    this.name = `cached:${inner.name}`;
  }

  async translateStructured(
    input: TranslateStructuredInput,
  ): Promise<StructuredFields> {
    const key = this.hash(input);
    const hit = this.cache.get(key);
    if (hit) return { ...hit.fields };

    const fields = await this.inner.translateStructured(input);
    this.cache.set(key, { fields, provider: this.inner.name });
    return fields;
  }

  wasCached(input: TranslateStructuredInput): boolean {
    return this.cache.has(this.hash(input));
  }

  getInnerName(): string {
    return this.inner.name;
  }

  private hash(input: TranslateStructuredInput): string {
    return createHash('sha256')
      .update(
        JSON.stringify({
          fields: input.fields,
          target: input.targetLanguage,
          source: input.sourceLanguage ?? null,
        }),
      )
      .digest('hex');
  }
}
