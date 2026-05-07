# Unsaid Notes

Private AI reflection journal for hard conversations—arguments, boundaries, apologies, and messages you should not send. **Not therapy, legal advice, or crisis support.**

**Tagline:** Say it here before you say it out loud.

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS  
- Supabase Auth + Postgres + Row Level Security  
- Zod, multi-provider AI — **MVP default:** Groq `llama-3.1-8b-instant` (optional upgrade: `llama-3.3-70b-versatile` if outputs feel too generic)

## Local setup

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local`:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (Settings → API) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client key |
| `AI_PROVIDER` | **`groq`** (MVP default) \| `openai` \| `anthropic` |
| `GROQ_API_KEY` | [Groq API key](https://console.groq.com/) |
| `GROQ_MODEL` | Default in `.env.example`: **`llama-3.1-8b-instant`**. For richer tone, try **`llama-3.3-70b-versatile`**. |
| Other providers | Set `AI_PROVIDER` and matching `OPENAI_*` or `ANTHROPIC_*` if not using Groq |

Optional:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata / OG (e.g. `https://yourdomain.com`) |
| `DEBUG_ENDPOINTS_ENABLED` | Set to `true` in `.env.local` only to enable `/api/debug/*` (omit in production) |

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase database

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL in `supabase/migrations/001_reflections.sql` (SQL Editor), **or** link the CLI and run `supabase db push`.
3. Configure **Auth → URL configuration**:
   - **Site URL:** your production origin (e.g. `https://yourdomain.com`) or `http://localhost:3000` for local dev.
   - **Redirect URLs:** include  
     `http://localhost:3000/auth/callback`  
     `https://yourdomain.com/auth/callback`  
     (Add `http://localhost:3000/**` during development if you use preview URLs.)

Email confirmation and OAuth should redirect to **`/auth/callback`** so the server can exchange the `code` for a session. If Supabase still sends users to `/?code=...`, middleware forwards that to `/auth/callback` with the same query string.

After a successful exchange, users are sent to **`/dashboard`**, which immediately redirects to **`/app/dashboard`**.

## Troubleshooting

**`Cannot find module './vendor-chunks/@supabase.js'` (or random `./123.js`) in dev**

Your `.next` folder is out of sync with the running compiler (often after Fast Refresh, editing `.env.local`, or interrupted builds). Stop the dev server, delete the cache, and start again:

```bash
rm -rf .next
npm run dev
```

If it keeps happening, run a clean production build once: `npm run build && npm run dev`.

**Email confirm / `PKCE code verifier not found`**

The confirmation link must open in the **same browser** (and profile) where you started sign-up, so the PKCE cookie is present. Opening the link from another device, an in-app mail browser, or after clearing cookies will fail—request a new confirmation email and try again in the same browser.

## Scripts

```bash
npm run lint
npm run build
npm start
```

## Deployment (e.g. Vercel)

1. Connect the Git repo; set **Root** to this folder if it is not the repo root.
2. Add the same environment variables as in `.env.example` (use **Publishable** or **anon** key for `NEXT_PUBLIC_*`, never service role in public vars).
3. Set `NEXT_PUBLIC_SITE_URL` to the deployed origin.
4. In Supabase, add your production `/auth/callback` URL to **Redirect URLs** and set **Site URL** to production.
5. Run `npm run build` locally or rely on CI to verify.

### Netlify (Next.js App Router)

Netlify’s [Next.js runtime](https://docs.netlify.com/frameworks/next-js/overview/) runs Route Handlers such as `POST /api/reflect` the same way as other Next hosts, as long as the site is built as a Next.js project (no custom adapter needed for standard `src/app/api/**/route.ts`).

**Build environment**

| Variable | Required | Notes |
|----------|-----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Same as local |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | At least one must be set |
| `AI_PROVIDER` | Yes | e.g. `groq` |
| `GROQ_API_KEY` | If `AI_PROVIDER=groq` | Missing key returns JSON `{ code: "missing_env" }`, not a crash |
| `GROQ_MODEL` | No | Defaults in code to `llama-3.1-8b-instant` |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | If `AI_PROVIDER=openai` | |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | If `AI_PROVIDER=anthropic` | |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Production origin for metadata and auth flows |
| `DEBUG_ENDPOINTS_ENABLED` | No | Set to `true` only while diagnosing; **unset or `false` in production** so `/api/debug/*` returns 404 |

**Netlify production checklist (common 502 / stale UI causes)**

1. **Deploy the latest commit** — confirm the connected Git branch and that the latest build finished successfully.
2. **Environment variables** — in **Site configuration → Environment variables**, set `GROQ_API_KEY` when using Groq (and the rest of the table above). A missing Groq key yields `{ "code": "missing_env" }` from `/api/reflect` once this code is live.
3. **Supabase** — run **all** migrations on the production project, including `supabase/migrations/002_ai_reminder.sql`. Without `ai_reminder`, saves fail with `{ "code": "db_insert_failed" }`.
4. **Clear cache** — in **Deploys**, use **Trigger deploy → Clear cache and deploy site** so the CDN serves fresh HTML/JS after a fix.

If `ai_reminder` is missing in production, function logs may include a hint to apply migration 002.

**Debugging `POST /api/reflect`:** responses use `{ "ok": false, "code", "message" }` (and successes include `"ok": true`). Check Netlify function logs for lines like `[api/reflect] missing_env`.

### Production debug (temporary)

Debug routes respond with **404** unless the **server** env var `DEBUG_ENDPOINTS_ENABLED` is exactly `true` (trimmed, case-insensitive). Set it in `.env.local` for local troubleshooting only. **In production (e.g. Netlify), leave it unset or set `DEBUG_ENDPOINTS_ENABLED=false`** after you finish debugging so `/api/debug/env` and `/api/debug/db` stay disabled.

When enabled:

1. **`GET /api/debug/env`** — Confirms presence of public Supabase URL, client key (anon **or** publishable counts for `NEXT_PUBLIC_SUPABASE_ANON_KEY`), `GROQ_API_KEY`, `AI_PROVIDER`, resolved `GROQ_MODEL`, and optional `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_APP_URL`. Returns only booleans and safe metadata.
2. **`GET /api/debug/db`** — **While logged in** in the browser (same origin so session cookies apply), open `/api/debug/db`. Confirms `reflections` is readable and the `ai_reminder` column exists. If the column is missing, response includes `code: "missing_ai_reminder_column"` and points to `002_ai_reminder.sql`.
3. **Netlify** — **Functions** logs for `console.error` tags: `[api/reflect]`, `[groq]`, `[api/debug/db]`.

Remove `/api/debug/*` entirely before a public launch if you prefer not to ship the routes at all; otherwise keep `DEBUG_ENDPOINTS_ENABLED` off in production.

See `docs/LAUNCH_CHECKLIST.md` before go-live.

## License

Private / your product—add a license if you open-source.
