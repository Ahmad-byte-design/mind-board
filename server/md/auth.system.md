# Prompt: Laravel API Auth Backend (Sanctum, cookie-based) for MindBoard

Act as a senior Laravel backend engineer. Build the **authentication system** for a Laravel API backend that serves a React (TypeScript) frontend. This is API-only — no Blade views.

## Context

- Laravel (latest LTS), PHP 8.2+
- Auth via **Laravel Sanctum's SPA (cookie/session) authentication** — not Bearer tokens in the JSON response, not localStorage. The frontend and API share a top-level domain (e.g. `app.mindboard.com` + `api.mindboard.com`), so an httpOnly, secure session cookie is used instead.
- Frontend calls with `axios`/`fetch` using `withCredentials: true` (or `credentials: 'include'`); no `Authorization` header needed.
- Existing `User` model with the default `name`, `email`, `password` columns — don't recreate it, just add what auth needs.

## Cookie/session auth setup (do this first)

- `config/sanctum.php`: set `stateful` to include the frontend domain(s) (`SANCTUM_STATEFUL_DOMAINS` env var).
- `config/cors.php`: `supports_credentials => true`, `allowed_origins` set to the frontend URL (not `*`).
- `.env`: `SESSION_DOMAIN=.mindboard.com`, `SESSION_DRIVER=database` (or redis) so sessions can be looked up/revoked server-side, `SANCTUM_STATEFUL_DOMAINS=app.mindboard.com`.
- `bootstrap/app.php` (or `app/Http/Kernel.php` on older versions): ensure `EnsureFrontendRequestsAreStateful` is in the `api` middleware group, before `auth:sanctum`.
- Frontend must `GET /sanctum/csrf-cookie` once before the first POST (login/register) to receive the `XSRF-TOKEN` cookie; axios reads it automatically and sends it as `X-XSRF-TOKEN`.
- `auth:sanctum` middleware works for both cookie-authenticated and token-authenticated requests, so mobile clients could still use Bearer tokens later without changing controllers.

## Architecture — follow this pattern strictly

**Controller → Service → Repository**, plus a Policy:

- **Controllers** stay thin: validate via a Form Request, call the Service, return a JSON response. No business logic in controllers.
- **Service** (`AuthService`) owns all business logic: hashing, login throttling, session regeneration on login/logout, password reset flow.
- **Repository** (`UserRepositoryInterface` + `UserRepository`) is the only layer that talks to Eloquent for `User`. Bind the interface to the implementation in a `RepositoryServiceProvider`.
- **Policy** (`UserPolicy`): a user can only view/update/delete their own record for now (extend later for admin roles).
- **Form Requests** for every input-taking endpoint (no inline `$request->validate()`).
- **API Resource** (`UserResource`) to shape user JSON — never return the raw model or the password hash.

## Endpoints to implement

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Creates user, logs them in (`Auth::login`), regenerates session, returns `user` only — no token in the body |
| POST | `/api/auth/login` | Public | `Auth::attempt`, regenerate session on success. Throttled per email+IP (e.g. 5 attempts/60s) |
| POST | `/api/auth/forgot-password` | Public | Sends reset link via Laravel's password broker |
| POST | `/api/auth/reset-password` | Public | Resets password with emailed token, invalidates the user's other sessions |
| GET | `/api/auth/me` | Sanctum (cookie) | Returns current user |
| POST | `/api/auth/logout` | Sanctum (cookie) | `Auth::guard('web')->logout()`, invalidate + regenerate the session, clear the session cookie |
| POST | `/api/auth/logout-all` | Sanctum (cookie) | Deletes all other session rows for this user from the `sessions` table (requires `SESSION_DRIVER=database`), then logs out current session too |
| PUT | `/api/auth/change-password` | Sanctum (cookie) | Requires current password; invalidates other sessions, keeps the current one alive |

Public endpoints should be rate-limited (e.g. `throttle:10,1`).

## Request/response conventions

- All responses are JSON with a `message` key, plus relevant data (`user` where applicable) — **never a `token` field**.
- Successful login/register: Laravel sets the session cookie in the response headers automatically via `Auth::login()`; the JSON body only carries `{ message, user }`.
- Validation errors return Laravel's default 422 shape (`message` + `errors`).
- Use Laravel's `Password::defaults()` rule for password strength.
- CSRF: every state-changing request (POST/PUT/DELETE) requires the `X-XSRF-TOKEN` header, which the frontend gets for free after calling `/sanctum/csrf-cookie` — call this out in the README so the frontend team doesn't get silent 419 errors.

## Deliverables

1. `UserRepositoryInterface` + `UserRepository`
2. `RepositoryServiceProvider` (binds the interface)
3. `AuthService` (register, login, logout, logoutFromAllDevices, sendPasswordResetLink, resetPassword, changePassword) — using `Auth::` facade / session regeneration instead of `createToken()`
4. Form Requests: `RegisterRequest`, `LoginRequest`, `ForgotPasswordRequest`, `ResetPasswordRequest`, `ChangePasswordRequest`
5. `UserResource`
6. `UserPolicy`
7. `AuthController` (register, login, logout, logoutAll, me) and `PasswordController` (forgot, reset, change) under `App\Http\Controllers\Api\Auth`
8. Routes file wiring all 8 endpoints with correct middleware (`web` + `auth:sanctum` where noted — cookie auth needs the `web` middleware group for session/CSRF, unlike token auth which only needs `api`)
9. `config/sanctum.php`, `config/cors.php`, and `.env` changes needed, spelled out explicitly
10. A short README covering: the `/sanctum/csrf-cookie` handshake the frontend must do, where to register the provider/policy, and example request/response JSON for every endpoint

## Style

- Strict types where practical, constructor property promotion, PHP 8 syntax
- No logic duplication between controllers — shared behavior belongs in the service
- Comment only where intent isn't obvious from the code
