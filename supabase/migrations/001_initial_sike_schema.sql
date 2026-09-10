create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username text,
 avatar_url text,
 created_at timestamptz default now(),
 updated_at timestamptz default now()
);

create table if not exists public.wallets (
 id uuid primary key default gen_random_uuid(),
 user_id uuid unique references public.profiles(id) on delete cascade,
 stellar_address text,
 sike_balance numeric default 0,
 created_at timestamptz default now()
);

create table if not exists public.tasks (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 description text,
 reward_amount numeric default 0,
 category text,
 difficulty text,
 active boolean default true,
 created_at timestamptz default now()
);

create table if not exists public.task_completions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid references public.profiles(id) on delete cascade,
 task_id uuid references public.tasks(id) on delete cascade,
 status text default 'pending',
 proof_data jsonb,
 approved_at timestamptz,
 created_at timestamptz default now()
);

create table if not exists public.transactions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid references public.profiles(id) on delete cascade,
 type text,
 amount numeric,
 status text,
 reference text,
 created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.tasks enable row level security;
alter table public.task_completions enable row level security;
alter table public.transactions enable row level security;

create policy "profiles own access" on public.profiles for all using (auth.uid() = id);
create policy "wallet own access" on public.wallets for all using (auth.uid() = user_id);
create policy "tasks readable" on public.tasks for select using (active = true);
create policy "completion own access" on public.task_completions for all using (auth.uid() = user_id);
create policy "transactions own access" on public.transactions for select using (auth.uid() = user_id);
