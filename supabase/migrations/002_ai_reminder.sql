-- Short memorable reminder line from AI (guided reflection rhythm).
alter table public.reflections
  add column if not exists ai_reminder text;
