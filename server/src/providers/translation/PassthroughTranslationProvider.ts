import type { StructuredFields } from '@marriage/shared';
import type {
  TranslateStructuredInput,
  TranslationProvider,
} from './TranslationProvider';

/** Returns the same structured fields unchanged. */
export class PassthroughTranslationProvider implements TranslationProvider {
  readonly name = 'passthrough';

  async translateStructured(
    input: TranslateStructuredInput,
  ): Promise<StructuredFields> {
    return { ...input.fields };
  }
}
