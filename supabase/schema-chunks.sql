-- Run AFTER schema.sql in Supabase SQL Editor
-- Adds text extraction fields + document_chunks table

-- 1) Expand document status values
alter table public.documents drop constraint if exists documents_status_check;

alter table public.documents
  add constraint documents_status_check
  check (status in ('uploaded', 'processing', 'processed', 'failed'));

-- 2) Extra columns on documents
alter table public.documents
  add column if not exists page_count int,
  add column if not exists text_length int,
  add column if not exists chunk_count int default 0,
  add column if not exists processed_at timestamptz,
  add column if not exists error_message text;

-- 3) Chunks table (one row per text chunk)
create table if not exists public.document_chunks (
  id uuid primary key,
  document_id uuid not null references public.documents (id) on delete cascade,
  chunk_index int not null check (chunk_index >= 0),
  content text not null,
  char_count int not null check (char_count > 0),
  token_estimate int not null check (token_estimate > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create index if not exists document_chunks_document_id_idx
  on public.document_chunks (document_id);

-- 4) RLS for chunks (read-only for now)
alter table public.document_chunks enable row level security;

create policy "Allow public read document_chunks"
  on public.document_chunks
  for select
  using (true);

-- embedding vector column can be added later:
-- alter table public.document_chunks add column embedding vector(1536);
