# Phase 2 handoff — Authentication

## Done

- Shared: `AuthProvider`, `UserRole`, `PublicUser`, auth payloads
- User model + repository (email / Google)
- Password hashing (bcrypt), JWT access tokens
- Google token verifier abstraction (`GoogleTokenVerifier`)
- Routes: register, login, google, logout, me
- Auth rate limiting + `authenticate` middleware
- Client: Redux auth slice, login/register/account, `ProtectedRoute`
- Session token in `sessionStorage` + `Authorization: Bearer`

## APIs

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/v1/auth/register` | No |
| POST | `/api/v1/auth/login` | No |
| POST | `/api/v1/auth/google` | No (needs `GOOGLE_CLIENT_ID`) |
| POST | `/api/v1/auth/logout` | No (client clears token) |
| GET | `/api/v1/auth/me` | Bearer JWT |

## Env

- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `GOOGLE_CLIENT_ID` / `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (optional)

## Remaining

Phase 3 — Biodata multi-step form, Redux draft, save/update, photo upload architecture
