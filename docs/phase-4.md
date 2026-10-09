# Phase 4 handoff — Templates

## Done

- Shared template registry (6 templates across 6 categories)
- `GET /api/v1/templates` and `GET /api/v1/templates/:id`
- Client template engine (`renderTemplate`) + per-template renderers
- View-model builder respects `hiddenFields`
- Wizard steps: Template selection + Live preview
- Redux `templateSlice` for selected template

## Templates

| Id | Name | Category |
|----|------|----------|
| traditional_maroon | Maroon Classic | Traditional |
| modern_clean | Modern Clean | Modern |
| elegant_serif | Elegant Serif | Elegant |
| minimal_line | Minimal Line | Minimal |
| royal_gold | Royal Gold | Royal |
| floral_soft | Floral Soft | Floral |

## Architecture

```text
BiodataContent → buildViewModel → renderTemplate(templateId) → Renderer
```

Adding a template = registry entry + renderer + switch case. No biodata form changes.

## Remaining

Phase 5 — Multilingual export language selector + translation provider
