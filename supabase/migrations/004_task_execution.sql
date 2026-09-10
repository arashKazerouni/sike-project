create table if not exists public.mission_submissions (
  id uuid primary key default gen_random_uuid(),
  mission_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  proof text not null,
  status text not null default 'submitted' check (status in ('submitted', 'approved', 'rejected')),
  reviewer_id uuid references auth.users(id),
  reviewer_note text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (mission_id, user_id)
);

create table if not exists public.sike_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_id text not null,
  amount numeric(20, 6) not null check (amount > 0),
  type text not null default 'mission_reward',
  created_at timestamptz not null default now(),
  unique (mission_id, user_id, type)
);

create index if not exists mission_submissions_user_idx on public.mission_submissions (user_id);
create index if not exists mission_submissions_mission_idx on public.mission_submissions (mission_id);
create index if not exists sike_ledger_user_idx on public.sike_ledger (user_id, created_at desc);

alter table public.mission_submissions enable row level security;
alter table public.sike_ledger enable row level security;

drop policy if exists "mission_runs_update_own" on public.mission_runs;

drop policy if exists "mission_submissions_select_own" on public.mission_submissions;
drop policy if exists "mission_submissions_insert_own" on public.mission_submissions;
drop policy if exists "sike_ledger_select_own" on public.sike_ledger;

create policy "mission_submissions_select_own"
on public.mission_submissions for select
to authenticated using ((select auth.uid()) = user_id);

create policy "mission_submissions_insert_own"
on public.mission_submissions for insert
to authenticated with check ((select auth.uid()) = user_id);

create policy "sike_ledger_select_own"
on public.sike_ledger for select
to authenticated using ((select auth.uid()) = user_id);

create or replace function public.submit_mission(p_mission_id text, p_proof text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_status text;
  v_submission_id uuid;
begin
  if v_user_id is null then
    raise exception 'authentication_required';
  end if;

  if p_mission_id is null or length(trim(p_mission_id)) = 0 or length(p_mission_id) > 100 then
    raise exception 'invalid_mission';
  end if;

  if p_proof is null or length(trim(p_proof)) < 20 or length(p_proof) > 10000 then
    raise exception 'invalid_proof';
  end if;

  select status into v_status
  from public.mission_runs
  where mission_id = p_mission_id and user_id = v_user_id
  for update;

  if not found then
    raise exception 'mission_not_initialized';
  end if;

  if v_status in ('verified', 'rejected') then
    raise exception 'mission_closed';
  end if;

  if v_status = 'submitted' then
    raise exception 'mission_already_submitted';
  end if;

  insert into public.mission_submissions (mission_id, user_id, proof)
  values (p_mission_id, v_user_id, trim(p_proof))
  returning id into v_submission_id;

  update public.mission_runs
  set status = 'submitted', updated_at = now()
  where mission_id = p_mission_id and user_id = v_user_id;

  return jsonb_build_object('submission_id', v_submission_id, 'status', 'submitted');
end;
$$;

revoke all on function public.submit_mission(text, text) from public, anon;
grant execute on function public.submit_mission(text, text) to authenticated;

create or replace function public.review_mission(
  p_mission_id text,
  p_user_id uuid,
  p_reviewer_id uuid,
  p_approved boolean,
  p_reward numeric,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_submission public.mission_submissions%rowtype;
  v_ledger_id uuid;
  v_status text;
begin
  if p_reward <= 0 then
    raise exception 'invalid_reward';
  end if;

  select * into v_submission
  from public.mission_submissions
  where mission_id = p_mission_id and user_id = p_user_id
  for update;

  if not found then
    raise exception 'submission_not_found';
  end if;

  if v_submission.status <> 'submitted' then
    raise exception 'submission_already_reviewed';
  end if;

  v_status := case when p_approved then 'approved' else 'rejected' end;

  update public.mission_submissions
  set status = v_status,
      reviewer_id = p_reviewer_id,
      reviewer_note = nullif(trim(coalesce(p_note, '')), ''),
      reviewed_at = now()
  where id = v_submission.id;

  update public.mission_runs
  set status = case when p_approved then 'verified' else 'rejected' end,
      updated_at = now()
  where mission_id = p_mission_id and user_id = p_user_id;

  if p_approved then
    insert into public.sike_ledger (user_id, mission_id, amount, type)
    values (p_user_id, p_mission_id, p_reward, 'mission_reward')
    on conflict (mission_id, user_id, type) do nothing
    returning id into v_ledger_id;

    if v_ledger_id is null then
      select id into v_ledger_id
      from public.sike_ledger
      where mission_id = p_mission_id and user_id = p_user_id and type = 'mission_reward';
    end if;
  end if;

  return jsonb_build_object(
    'status', v_status,
    'ledger_id', v_ledger_id,
    'reward', case when p_approved then p_reward else 0 end
  );
end;
$$;

revoke all on function public.review_mission(text, uuid, uuid, boolean, numeric, text) from public, anon, authenticated;
grant execute on function public.review_mission(text, uuid, uuid, boolean, numeric, text) to service_role;
