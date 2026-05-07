-- Privacy-safe product analytics: event names + coarse metadata only (no user content).

create table if not exists public.app_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_name text not null,
  category text,
  intensity integer,
  success boolean,
  error_code text,
  created_at timestamptz not null default now(),
  constraint app_events_event_name_check check (
    event_name in (
      'reflection_started',
      'reflection_generate_attempt',
      'reflection_generate_success',
      'reflection_generate_failed',
      'repair_message_copied',
      'boundary_copied',
      'share_card_copied',
      'reflection_deleted'
    )
  ),
  constraint app_events_intensity_range check (
    intensity is null or (intensity >= 1 and intensity <= 5)
  )
);

create index if not exists app_events_user_created_idx
  on public.app_events (user_id, created_at desc);

create index if not exists app_events_event_created_idx
  on public.app_events (event_name, created_at desc);

alter table public.app_events enable row level security;

drop policy if exists "app_events_insert_own" on public.app_events;

create policy "app_events_insert_own"
  on public.app_events for insert
  to authenticated
  with check (auth.uid() = user_id);

-- No select/update/delete for authenticated clients — inserts only. Reads via service role if needed.
