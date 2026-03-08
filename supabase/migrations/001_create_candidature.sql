create table candidature (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nome text not null,
  cognome text not null,
  email text not null,
  telefono text not null,
  camera_preferita text not null,
  status text not null,
  tipo_contratto text,
  nome_azienda text,
  tipo_attivita text,
  settore text,
  universita text,
  garanzie text,
  tipo_contratto_garante text,
  azienda_garante text,
  note text,
  consenso_privacy boolean not null default false,
  stato_candidatura text default 'nuova'
);

alter table candidature enable row level security;

create policy "insert_public" on candidature
  for insert to anon with check (true);

create policy "read_authenticated" on candidature
  for select to authenticated using (true);

create policy "update_authenticated" on candidature
  for update to authenticated using (true);

create policy "delete_authenticated" on candidature
  for delete to authenticated using (true);
