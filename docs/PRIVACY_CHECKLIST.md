# Privacy checklist (Unsaid Notes)

Use this before labeling the product “public” or scaling traffic.

## Data access

- **Row Level Security (RLS)** is enabled on `public.reflections` in Supabase, with policies that scope `select`, `insert`, `update`, and `delete` to the owning user (`auth.uid() = user_id`). Confirm in the Supabase SQL editor or Table Editor → policies.
- **No service role in the browser.** Only `NEXT_PUBLIC_SUPABASE_*` publishable/anon keys and the user session should reach client bundles. Service role keys belong in server-only scripts or trusted backends—this app does not ship them to the client.
- **Secrets stay server-side.** `GROQ_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and any future admin keys must be set only in the host’s environment (e.g. Netlify), never as `NEXT_PUBLIC_*`.

## User control

- **Per-reflection delete** works via `DELETE /api/reflections/[id]` (authenticated, user-scoped).
- **Delete all reflections** works via `DELETE /api/reflections` from **Privacy & your data** (`/app/settings/privacy`), after typing the confirmation phrase.

## Temporary debug routes

- `/api/debug/env` and `/api/debug/db` return **404** unless **`DEBUG_ENDPOINTS_ENABLED=true`** (server-only env). When enabled, they help diagnose config/schema without returning secrets—but they still reveal whether variables are set and whether `ai_reminder` exists.
- **Production:** leave `DEBUG_ENDPOINTS_ENABLED` **unset or `false`** after debugging. Optional: delete the `/api/debug/*` routes before a broad public launch, or add edge IP/auth on top if you must leave the flag on temporarily.

## Product boundaries (trust copy)

- Marketing and in-app copy should continue to state that Unsaid Notes is **not** therapy, legal advice, crisis support, or professional counseling, and that reflections are **not** shown publicly.

## Ongoing

- Re-run this checklist after major schema, auth, or deployment changes.
- When **account deletion** is implemented end-to-end, document the flow here (Supabase Auth user delete + data purge) and update `/app/settings/privacy`.
