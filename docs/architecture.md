# Architecture

## Funnel

```text
Free wedding tools → Marriage Biodata Maker → Preview
  → Translate → Export → ₹151 Wedding Pass (30 days)
```

The biodata maker is the product. Free tools are acquisition. The Wedding Pass is monetization.

## Layers (server)

```text
Route → validateRequest → Controller → Service → Repository → MongoDB
```

Controllers stay thin. Business logic lives in services. DB access lives in repositories.

## Shared contracts

All APIs use:

```json
{ "success": true, "message": "...", "data": {} }
```

Errors:

```json
{ "success": false, "message": "...", "error": { "code": "..." } }
```

## Constraints

- TypeScript only (`.ts` / `.tsx`)
- Every source file ≤ 100 lines
- Feature-based client folders under `client/features/`
- Provider interfaces for translation, export, storage (swap later)
