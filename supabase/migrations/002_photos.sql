-- Tabella foto
create table photos (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  storage_path text not null,
  url text not null,
  alt text not null default '',
  "order" integer not null default 999,
  is_cover boolean not null default false,
  created_at timestamptz default now()
);

alter table photos enable row level security;

create policy "public_read" on photos for select using (true);
create policy "admin_insert" on photos for insert to authenticated with check (true);
create policy "admin_update" on photos for update to authenticated using (true);
create policy "admin_delete" on photos for delete to authenticated using (true);

create index photos_section_idx on photos(section);

-- Storage bucket pubblico
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Storage policies
create policy "public_read_photos" on storage.objects
  for select using (bucket_id = 'photos');

create policy "admin_upload_photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos');

create policy "admin_delete_photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos');
