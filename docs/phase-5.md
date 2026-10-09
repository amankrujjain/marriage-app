# Phase 5 handoff — Multilingual

## Done

- Language options for 9 Indian languages (shared)
- Structured field flatten / rehydrate helpers
- `TranslationProvider` abstraction:
  - OpenAI (when `AI_API_KEY` set)
  - Dictionary offline fallback
  - Passthrough when source === target
  - In-memory cache decorator
- APIs:
  - `POST /api/v1/translation/translate`
  - `POST /api/v1/translation/translate-biodata`
- Wizard **Language** step + Generate preview (translation once, not on keystroke)
- Preview uses translated content when available

## Env

```text
AI_PROVIDER=openai
AI_API_KEY=
```

Without `AI_API_KEY`, dictionary fallback translates known values and leaves others unchanged.

## Remaining

Phase 6 — PDF / image export + WhatsApp share
