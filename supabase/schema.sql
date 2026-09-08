create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('user','admin','owner')),
  created_at timestamptz not null default now()
);

create unique index if not exists one_extra_admin on public.profiles ((role)) where role='admin';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name) values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text not null default '100g',
  price numeric(10,2) not null default 0,
  description text,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id boolean primary key default true check (id = true),
  about_title text not null default 'মশলাই — আমাদের গল্প',
  about_text text not null default '',
  contact_phone text not null default '',
  contact_whatsapp text not null default '',
  contact_address text not null default 'Bangladesh',
  hero_image_url text,
  hero_title text not null default 'স্বাদের শুরু ভালো মশলায়',
  hero_subtitle text not null default 'Premium spices, সুন্দর রঙ, authentic taste — মশলাই।',
  facebook_url text,
  instagram_url text
);

insert into public.site_settings(id) values (true) on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.site_settings enable row level security;

create or replace function public.is_admin_or_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role in ('owner','admin'));
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='owner');
$$;

create policy "Public can read active products" on public.products for select using (active = true or public.is_admin_or_owner());
create policy "Admins manage products" on public.products for all using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create policy "Public can read settings" on public.site_settings for select using (true);
create policy "Admins update settings" on public.site_settings for update using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create policy "Users see own profile" on public.profiles for select using (id=auth.uid() or public.is_admin_or_owner());
create policy "Owner can update profile roles" on public.profiles for update using (public.is_owner()) with check (public.is_owner());

-- Keep profile emails synchronized for users created after this trigger is installed.
create or replace function public.sync_profile_email()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set email=new.email where id=new.id; return new;
end; $$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated after update of email on auth.users for each row execute procedure public.sync_profile_email();

-- IMPORTANT: after your first signup, run the one-time owner promotion below.
-- update public.profiles set role='owner' where id=(select id from auth.users where email='YOUR_OWNER_EMAIL');

insert into public.products (name,unit,price,description,image_url)
select 'Kashmiri Red Chilli Powder','100g',0,'Vibrant color, mild heat, authentic taste.','/moshlai-chilli-demo.png'
where not exists (select 1 from public.products);

-- Storage bucket for admin-uploaded images.
insert into storage.buckets (id,name,public)
values ('media','media',true)
on conflict (id) do nothing;

create policy "Public can view media" on storage.objects for select using (bucket_id='media');
create policy "Admins upload media" on storage.objects for insert with check (bucket_id='media' and public.is_admin_or_owner());
create policy "Admins update media" on storage.objects for update using (bucket_id='media' and public.is_admin_or_owner());
create policy "Admins delete media" on storage.objects for delete using (bucket_id='media' and public.is_admin_or_owner());
