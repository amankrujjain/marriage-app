# Phase 6 handoff — Export

## Done

- `ExportProvider` abstraction (PDF via pdf-lib, PNG/JPG passthrough)
- `POST /api/v1/export` (auth + Wedding Pass / `premiumUntil` required)
- Client captures preview DOM (`html-to-image`) — no heavy PDF logic in UI
- Download buttons for PDF / PNG / JPG on Preview step
- WhatsApp share deep-link after successful export
- `/wedding-pass` page (checkout arrives in Phase 7)

## API

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| POST | `/api/v1/export` | Yes + premium | body: format, imageBase64, fileName? |

Non-premium → `402` / `PREMIUM_REQUIRED`.

## Flow

```text
Preview DOM → capture image → POST /export → file URL
  → Download | WhatsApp share text+link
```

## Remaining

Phase 7 — Razorpay ₹151 Wedding Pass (sets `premiumUntil`)
