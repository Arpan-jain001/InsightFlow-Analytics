# InsightFlow backend: security review

Scope: `backend_1.zip` (auth, middleware, routes, ingest, services). I read it carefully but did **not** run it against your database, so please test locally after applying the patches (checklist at the bottom).

## Critical

### 1. Anyone could register as SUPER_ADMIN  (PATCHED)
`registerUser()` stored `role: role || "USER"` straight from the request body, and the `User.role` enum allows `SUPER_ADMIN`.
`POST /api/auth/register {"role":"SUPER_ADMIN", ...}` created an admin account. Login skips email verification for SUPER_ADMIN, and the register response already returns access tokens, so the attacker had full admin API access immediately.
**Fix:** only `USER` or `ORGANIZER` are accepted, everything else becomes `USER`. Company name is required for `ORGANIZER`.
**Please also check your database** for any unexpected `SUPER_ADMIN` users and rotate `JWT_SECRET` / `REFRESH_SECRET` if the app has been public.

## High

### 2. Login checked the role before the password  (PATCHED)
`loginUser()` returned "Your role is not correct for this account" (403) before checking the password. An attacker could learn which emails exist and what role each has, without knowing any password. It also forced the client to send a role.
**Fix:** the client sends only email and password. Password is checked first, errors are generic ("Invalid email or password"), and a dummy bcrypt compare equalises timing for unknown emails. The role always comes from the database.

### 3. Google login skipped organizer approval and could hijack unverified accounts  (PATCHED)
- `googleLogin()` did not check `verificationStatus`, so a PENDING organizer could log in through Google.
- If someone pre-registered with a victim's email and password (never verified), then the victim signed in with Google, the attacker's password kept working (pre-account-takeover).
- `email_verified` from Google was ignored for existing users.
**Fix:** unverified Google emails are rejected, pending organizers are blocked, SUPER_ADMIN must use password login, and a Google claim on an unverified password account removes the old password.
Note: if you currently sign in as admin with Google, remove the SUPER_ADMIN check in `googleLogin`.

### 4. Unverified accounts received working tokens  (PATCHED)
`/register` returns access and refresh tokens, and `protect` never checked `emailVerified`. **Fix:** `protect` now rejects unverified emails (SUPER_ADMIN excepted) and pins the JWT algorithm to HS256.

## Medium

### 5. CORS reflected every origin with credentials  (PATCHED)
`cors({ origin: true, credentials: true })`. **Fix:** the app only answers `CORS_ORIGINS` (falls back to `FRONTEND_URL` / `CLIENT_URL`). `/api/ingest` stays open on purpose because customer websites call it. If none of the env vars is set it still allows all (dev) and logs a warning.

### 6. Admin APIs answered 403 "Super Admin only"  (PATCHED)
That confirms the admin API exists. Now non-admins get the same 404 body as any unknown route.

### 7. Ingest endpoint hardening  (PATCHED)
Client `ts` could be any date (poisoned analytics, or an invalid date causing 500). `$`/dotted keys in `properties` went into MongoDB, ids were not type-checked, and `x-api-key` could be a non-string. All handled.
Design notes (not changed): the API key is public by nature (it sits in website HTML). `allowedDomains` is enforced only when the request has an `Origin`/`Referer`, so a script using curl bypasses it. If a project sets allowed domains, consider rejecting requests without Origin unless the project is marked server-side.

### 8. Weak randomness and missing throttling
- Email OTP used `Math.random()`. PATCHED to `crypto.randomInt`.
- `authLimiter` (10 per 10 min) is only on register, login and google. **Not patched:** add it to `/verify-email-otp`, `/resend-verification`, `/forgot-password`, `/reset-password-otp`. A 6-digit OTP without a limiter can be brute-forced inside its 10 minute life.
- Rate limiting is in memory and per IP; fine for one instance. Add per-account lockout after repeated failures when you scale.

## Low / recommendations (not patched)
- Refresh tokens are stored in plain text in the DB and are not rotated. Store a SHA-256 hash and rotate on `/refresh`.
- The frontend keeps tokens in `localStorage`, so one XSS bug leaks sessions. Move to httpOnly, Secure, SameSite cookies (you already have `COOKIE_SECURE` / `COOKIE_SAMESITE` env names).
- `GET /auth/verify-login/:token?action=` changes state on GET; email scanners can trigger it. Use a confirmation page with POST.
- Model password `minlength: 6` vs the new 8 minimum in `registerUser`; align them. Verification tokens are stored unhashed.
- Add input validation (zod/joi) and `express-mongo-sanitize` globally.
- `.env` in the zip was empty (good). Never upload real secrets anywhere; if one ever leaves your machine, rotate it.
- `frontendUrl.js` still has old default names (`pulseiqai.netlify.app`, `pulseiq-ffio.onrender.com`). Set `FRONTEND_URL` in production.

## Files changed (copy over your project)
`src/app.js`, `src/middleware/auth.middleware.js`, `src/middleware/admin.middleware.js`, `src/middleware/superAdmin.middleware.js`, `src/routes/auth.routes.js`, `src/routes/ingest.routes.js`, `src/services/auth.service.js`

## Test checklist
1. `POST /api/auth/register` with `"role":"SUPER_ADMIN"` returns a USER account (check `role` in the response).
2. `POST /api/auth/login` with `{email,password}` and no role works; wrong password or unknown email both return `Invalid email or password`.
3. A pending ORGANIZER cannot log in by password or by Google.
4. An unverified user's token gets `403 Please verify your email first` on any protected route.
5. A normal user calling `/api/admin/users` gets 404.
6. Your website, from another origin, can still POST `/api/ingest/event`; your frontend can still log in.
7. Set `CORS_ORIGINS` (comma separated) on Render/your host.
