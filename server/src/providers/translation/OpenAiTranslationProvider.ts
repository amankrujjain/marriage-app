import type { StructuredFields } from '@marriage/shared';
import { BadRequestError } from '../../errors/BadRequestError';
import type {
  TranslateStructuredInput,
  TranslationProvider,
} from './TranslationProvider';

export class OpenAiTranslationProvider implements TranslationProvider {
  readonly name = 'openai';

  constructor(
    private readonly apiKey: string,
    private readonly model = 'gpt-4o-mini',
  ) {}

  async translateStructured(
    input: TranslateStructuredInput,
  ): Promise<StructuredFields> {
    const keys = Object.keys(input.fields);
    if (keys.length === 0) return {};

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'Translate biodata field values. Return JSON with the exact same keys. Do not add keys.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              targetLanguage: input.targetLanguage,
              sourceLanguage: input.sourceLanguage ?? 'auto',
              fields: input.fields,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new BadRequestError('Translation provider failed', 'TRANSLATION_PROVIDER_ERROR');
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new BadRequestError('Empty translation response', 'TRANSLATION_EMPTY');
    }

    const parsed = JSON.parse(content) as Record<string, unknown>;
    const rawFields =
      typeof parsed.fields === 'object' && parsed.fields !== null
        ? (parsed.fields as StructuredFields)
        : (parsed as StructuredFields);
    return this.keepKeys(input.fields, rawFields);
  }

  private keepKeys(
    original: StructuredFields,
    translated: StructuredFields,
  ): StructuredFields {
    const result: StructuredFields = {};
    for (const key of Object.keys(original)) {
      const value = translated[key];
      result[key] = typeof value === 'string' ? value : (original[key] ?? '');
    }
    return result;
  }
}
