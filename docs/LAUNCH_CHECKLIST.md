# Launch smoke checklist — Unsaid Notes

Use before pointing a production domain at the app.

## Environment & Supabase

- [ ] `NEXT_PUBLIC_SUPABASE_URL` and publishable (or anon) key set in hosting dashboard.
- [ ] `AI_PROVIDER` and matching provider API key + model env vars set.
- [ ] `NEXT_PUBLIC_SITE_URL` matches production origin (for metadata).
- [ ] **No** `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_SECRET_KEY` in `NEXT_PUBLIC_*` or client bundles.
- [ ] Migration `001_reflections.sql` applied; `reflections` table exists with RLS policies.
- [ ] Supabase **Site URL** = production origin.
- [ ] Supabase **Redirect URLs** include `https://<prod-domain>/auth/callback` (and local callback for dev).

## Auth flows

- [ ] Sign up with email; confirmation link lands on `/auth/callback` (or `/?code=` then redirects); session works; user reaches `/app/dashboard`.
- [ ] Failed or missing `code` redirects to `/login?error=auth_callback_failed` and message is visible.
- [ ] Log in / log out; protected `/app/*` routes require session.
- [ ] Password reset / magic link (if enabled) uses the same callback URL pattern.

## Product paths

- [ ] Landing, Privacy, Login, Signup render on mobile.
- [ ] New reflection → AI response → saved detail with copy + share card.
- [ ] Dashboard empty state for new users; list after saving.
- [ ] Delete reflection shows confirmation and removes row.

## Performance & errors

- [ ] `npm run lint` and `npm run build` pass in CI or locally.
- [ ] 429 from rate limit on `/api/reflect` returns a clear message (optional stress test).

## Legal copy

- [ ] Privacy / disclaimer visible; states product is not therapy, legal advice, crisis support, or professional counseling.
