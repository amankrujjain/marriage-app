# Marriage Biodata

Create a beautiful marriage biodata in minutes. Indian wedding–oriented, mobile-first, multilingual, template-driven.

## Stack

- **client** — Next.js (App Router), TypeScript, Tailwind, Redux Toolkit
- **server** — Express, TypeScript, MongoDB, Mongoose, Joi
- **shared** — enums, types, constants

## Setup

```bash
cp .env.example .env
# edit MONGODB_URI and JWT_SECRET

npm install
npm run dev:server
npm run dev:client
```

- Client: http://localhost:3000
- API health: http://localhost:4000/api/v1/health

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:client` | Next.js dev server |
| `npm run dev:server` | Express API |
| `npm run typecheck` | TypeScript across workspaces |
| `npm run lint` | ESLint across workspaces |
| `npm run build` | Build shared → server → client |

## Auth pages

- `/register` — email/password account
- `/login` — sign in (Google when `GOOGLE_CLIENT_ID` is set)
- `/account` — protected session view

## Phases

1. Foundation
2. Authentication
3. Biodata maker
4. Templates
5. Multilingual export
6. Export (PDF / image) (current)
7. Razorpay ₹151 Wedding Pass

8. Free wedding tools
9. SEO & polish

See [docs/architecture.md](docs/architecture.md) and [docs/design-system.md](docs/design-system.md).
