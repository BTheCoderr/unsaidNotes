-- Unsaid Notes: reflections + RLS
-- App usage: insert/select/update/delete on public.reflections scoped by user_id (matches RLS auth.uid() = user_id).
-- Run in Supabase SQL editor or via migration tooling.

create table if not exists public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  raw_input text not null,
  category text not null,
  person_context text,
  intensity int check (
    intensity is null
    or (
      intensity >= 1
      and intensity <= 5
    )
  ),
  ai_summary text,
  ai_feeling text,
  ai_need text,
  ai_not_to_say text,
  ai_repair_message text,
  ai_boundary text,
  ai_next_step text,
  share_card_text text,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reflections_user_created_idx
  on public.reflections (user_id, created_at desc);

alter table public.reflections enable row level security;

drop policy if exists "reflections_select_own" on public.reflections;
drop policy if exists "reflections_insert_own" on public.reflections;
drop policy if exists "reflections_update_own" on public.reflections;
drop policy if exists "reflections_delete_own" on public.reflections;

create policy "reflections_select_own"
  on public.reflections for select
  using (auth.uid() = user_id);

create policy "reflections_insert_own"
  on public.reflections for insert
  with check (auth.uid() = user_id);

create policy "reflections_update_own"
  on public.reflections for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "reflections_delete_own"
  on public.reflections for delete
  using (auth.uid() = user_id);

create or replace function public.set_reflections_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reflections_set_updated_at on public.reflections;

create trigger reflections_set_updated_at
  before update on public.reflections
  for each row
  execute function public.set_reflections_updated_at();
