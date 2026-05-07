-- Tester feedback (no reflection content; optional user_id when logged in via API).

create table if not exists public.tester_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  useful boolean not null,
  better_text_sendable boolean not null,
  use_again boolean not null,
  felt_off text,
  email text,
  created_at timestamptz not null default now()
);

create index if not exists tester_feedback_created_idx
  on public.tester_feedback (created_at desc);

alter table public.tester_feedback enable row level security;

drop policy if exists "tester_feedback_insert" on public.tester_feedback;

create policy "tester_feedback_insert"
  on public.tester_feedback for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- No select/update/delete for app roles; use service role in Supabase dashboard for review.
