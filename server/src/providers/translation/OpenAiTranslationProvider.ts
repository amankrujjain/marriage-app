import {
  getLanguageOption,
  LanguageCode,
  PRESERVED_TRANSLATION_KEY_SET,
  type StructuredFields,
} from '@marriage/shared';
import { BadRequestError } from '../../errors/BadRequestError';
import type {
  TranslateStructuredInput,
  TranslationProvider,
} from './TranslationProvider';

const SYSTEM_PROMPT = `You translate marriage biodata field VALUES for a PDF export.

Rules:
- Translate ONLY the string values inside "fields".
- Return JSON with exactly this shape: {"fields":{...}} using the EXACT same keys as the input.
- Do not add, remove, or rename keys. Keys are paths like personal.religion and must stay unchanged.
- Do NOT translate keys or invent new fields.
- Keep emails, phone numbers, URLs, and pure numeric IDs unchanged.
- Keep dates readable; you may localize month names when natural, but preserve the intended date.
- Use the correct script for the target language.
- Prefer natural, formal phrasing suitable for a marriage biodata.
- If a value is already in the target language, return it unchanged.
- Never include markdown or commentary outside the JSON object.
- Personal names are omitted from the payload on purpose — do not invent name fields.`;

function languageLabel(code: LanguageCode | undefined): string {
  if (!code) return 'auto';
  return getLanguageOption(code)?.name ?? code;
}

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

    const preserved: StructuredFields = {};
    const toTranslate: StructuredFields = {};
    for (const [key, value] of Object.entries(input.fields)) {
      if (PRESERVED_TRANSLATION_KEY_SET.has(key)) {
        preserved[key] = value;
      } else {
        toTranslate[key] = value;
      }
    }

    if (Object.keys(toTranslate).length === 0) {
      return { ...preserved };
    }

    const targetName = languageLabel(input.targetLanguage);
    const sourceName = languageLabel(input.sourceLanguage ?? LanguageCode.EN);

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
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: JSON.stringify({
              task: 'Translate biodata field values only',
              targetLanguage: targetName,
              targetLanguageCode: input.targetLanguage,
              sourceLanguage: sourceName,
              sourceLanguageCode: input.sourceLanguage ?? LanguageCode.EN,
              fields: toTranslate,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      let detail = '';
      try {
        const errBody = (await response.json()) as {
          error?: { message?: string };
        };
        detail = errBody.error?.message ? `: ${errBody.error.message}` : '';
      } catch {
        /* ignore */
      }
      throw new BadRequestError(
        `Translation provider failed${detail}`,
        'TRANSLATION_PROVIDER_ERROR',
      );
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new BadRequestError('Empty translation response', 'TRANSLATION_EMPTY');
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content) as Record<string, unknown>;
    } catch {
      throw new BadRequestError(
        'Translation response was not valid JSON',
        'TRANSLATION_PARSE_ERROR',
      );
    }

    const rawFields =
      typeof parsed.fields === 'object' && parsed.fields !== null
        ? (parsed.fields as StructuredFields)
        : (parsed as StructuredFields);

    return {
      ...this.keepKeys(toTranslate, rawFields),
      ...preserved,
    };
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
