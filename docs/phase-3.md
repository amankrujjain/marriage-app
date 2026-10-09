# Phase 3 handoff — Biodata

## Done

- Shared biodata content model, enums, step order
- Mongo `Biodata` model + repository
- CRUD APIs (auth required) + photo upload
- `StorageProvider` + local disk implementation (`/uploads`)
- Multi-step Redux form (personal → photo)
- Optional fields + hide-in-biodata toggles
- Save draft creates/updates server record when logged in

## APIs

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/v1/biodata` | Yes |
| GET | `/api/v1/biodata` | Yes |
| GET | `/api/v1/biodata/:id` | Yes |
| PATCH | `/api/v1/biodata/:id` | Yes |
| DELETE | `/api/v1/biodata/:id` | Yes |
| POST | `/api/v1/biodata/upload-photo` | Yes |

## Remaining

Phase 4 — Template registry, selection, previews, rendering system
