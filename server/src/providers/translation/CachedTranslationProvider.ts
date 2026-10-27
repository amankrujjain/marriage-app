import { createHash } from 'crypto';
import type { StructuredFields } from '@marriage/shared';
import type {
  TranslateStructuredInput,
  TranslationProvider,
} from './TranslationProvider';

const DEFAULT_TTL_MS = 60 * 60 * 1000;
const DEFAULT_MAX_ENTRIES = 500;

interface CacheEntry {
  fields: StructuredFields;
  provider: string;
  expiresAt: number;
}

export class CachedTranslationProvider implements TranslationProvider {
  readonly name: string;
  private readonly cache = new Map<string, CacheEntry>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;

  constructor(
    private readonly inner: TranslationProvider,
    options?: { ttlMs?: number; maxEntries?: number },
  ) {
    this.name = `cached:${inner.name}`;
    this.ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
    this.maxEntries = options?.maxEntries ?? DEFAULT_MAX_ENTRIES;
  }

  async translateStructured(
    input: TranslateStructuredInput,
  ): Promise<StructuredFields> {
    const key = this.hash(input);
    const hit = this.cache.get(key);
    if (hit) {
      if (hit.expiresAt > Date.now()) {
        // Refresh LRU order
        this.cache.delete(key);
        this.cache.set(key, hit);
        return { ...hit.fields };
      }
      this.cache.delete(key);
    }

    const fields = await this.inner.translateStructured(input);
    this.evictIfNeeded();
    this.cache.set(key, {
      fields,
      provider: this.inner.name,
      expiresAt: Date.now() + this.ttlMs,
    });
    return fields;
  }

  wasCached(input: TranslateStructuredInput): boolean {
    const key = this.hash(input);
    const hit = this.cache.get(key);
    if (!hit) return false;
    if (hit.expiresAt <= Date.now()) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  getInnerName(): string {
    return this.inner.name;
  }

  /** Test helper — current live entry count (expired not pruned until read). */
  size(): number {
    return this.cache.size;
  }

  private evictIfNeeded(): void {
    while (this.cache.size >= this.maxEntries) {
      const oldest = this.cache.keys().next().value;
      if (oldest === undefined) break;
      this.cache.delete(oldest);
    }
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
