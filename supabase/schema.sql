-- ============================================================
-- AI 101 for PMs — community suggestion board schema (Supabase / Postgres)
-- Run this once in the Supabase SQL Editor.
--
-- Security model: the browser uses the public "anon" key. Anyone may
-- READ suggestions, INSERT a suggestion (sanitised by a trigger), and
-- cast/remove their own vote. Nobody using the anon key can change a
-- suggestion's status or delete it — the maintainer flips status from
-- the Supabase Table Editor. Vote counts are maintained server-side by
-- a trigger, so they can't be forged from the client.
-- ============================================================

create table if not exists suggestions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 3 and 120),
  detail      text check (char_length(detail) <= 1000),
  author_name text check (char_length(author_name) <= 60),
  status      text not null default 'open'
              check (status in ('open','planned','in_progress','shipped','declined')),
  upvotes     int  not null default 0,
  downvotes   int  not null default 0,
  score       int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists votes (
  suggestion_id uuid not null references suggestions(id) on delete cascade,
  voter_id      text not null,                  -- random id from the browser's localStorage
  value         smallint not null check (value in (-1, 1)),
  created_at    timestamptz not null default now(),
  primary key (suggestion_id, voter_id)         -- one vote per anonymous voter per idea
);

create index if not exists suggestions_score_idx on suggestions (score desc, created_at desc);

-- ---------- keep up/down/score counts correct after any vote change ----------
create or replace function refresh_counts() returns trigger
language plpgsql security definer as $$
declare sid uuid := coalesce(new.suggestion_id, old.suggestion_id);
begin
  update suggestions s set
    upvotes   = (select count(*) from votes v where v.suggestion_id = sid and v.value = 1),
    downvotes = (select count(*) from votes v where v.suggestion_id = sid and v.value = -1),
    score     = (select coalesce(sum(v.value), 0) from votes v where v.suggestion_id = sid)
  where s.id = sid;
  return null;
end $$;

drop trigger if exists trg_votes on votes;
create trigger trg_votes after insert or update or delete on votes
  for each row execute function refresh_counts();

-- ---------- force safe defaults on public inserts (ignore client-sent status/counts) ----------
create or replace function sanitize_suggestion() returns trigger
language plpgsql security definer as $$
begin
  new.status := 'open';
  new.upvotes := 0; new.downvotes := 0; new.score := 0;
  new.created_at := now();
  return new;
end $$;

drop trigger if exists trg_sanitize on suggestions;
create trigger trg_sanitize before insert on suggestions
  for each row execute function sanitize_suggestion();

-- ---------- Row-Level Security ----------
alter table suggestions enable row level security;
alter table votes enable row level security;

drop policy if exists "read suggestions"   on suggestions;
drop policy if exists "insert suggestions"  on suggestions;
create policy "read suggestions"   on suggestions for select using (true);
create policy "insert suggestions"  on suggestions for insert with check (true);
-- (no update/delete policy for anon → status changes happen via the dashboard / service role)

drop policy if exists "insert votes" on votes;
drop policy if exists "update votes" on votes;
drop policy if exists "delete votes" on votes;
create policy "insert votes" on votes for insert with check (true);
create policy "update votes" on votes for update using (true) with check (true);
create policy "delete votes" on votes for delete using (true);

-- ---------- grants for the anon role (RLS still applies on top) ----------
grant usage on schema public to anon;
grant select, insert on suggestions to anon;
grant insert, update, delete on votes to anon;
-- note: anon is intentionally NOT granted SELECT on votes; the client never
-- reads individual votes (it remembers its own choice in localStorage), and
-- the count trigger runs as definer so it can read votes regardless.

-- ---------- client-facing vote RPCs (SECURITY DEFINER) ----------
-- The browser votes through these functions instead of writing `votes`
-- directly. Casting or changing a vote is an UPSERT
-- (INSERT ... ON CONFLICT DO UPDATE); under RLS that path requires the caller
-- to be able to SELECT the conflicting row, which anon deliberately cannot do.
-- A SECURITY DEFINER function runs as the owner, performs the upsert safely,
-- validates the value, and keeps individual votes unreadable by anon.
create or replace function public.cast_vote(p_suggestion uuid, p_voter text, p_value int)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_value not in (-1, 1) then raise exception 'value must be -1 or 1'; end if;
  if p_voter is null or char_length(p_voter) not between 1 and 100 then raise exception 'invalid voter'; end if;
  insert into votes (suggestion_id, voter_id, value)
  values (p_suggestion, p_voter, p_value::smallint)
  on conflict (suggestion_id, voter_id) do update set value = excluded.value, created_at = now();
end $$;

create or replace function public.remove_vote(p_suggestion uuid, p_voter text)
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from votes where suggestion_id = p_suggestion and voter_id = p_voter;
end $$;

-- only anon may call them (not arbitrary public roles)
revoke all on function public.cast_vote(uuid, text, int) from public;
revoke all on function public.remove_vote(uuid, text) from public;
grant execute on function public.cast_vote(uuid, text, int) to anon;
grant execute on function public.remove_vote(uuid, text) to anon;
