-- Run this in Supabase: SQL Editor → New query → Paste → Run
-- https://supabase.com/dashboard → your project → SQL Editor

-- 1) Table: stores PDF metadata (the actual file lives in Storage)
create table if not exists public.documents (
  id uuid primary key,
  file_name text not null,
  file_path text not null unique,
  file_size bigint not null check (file_size > 0),
  mime_type text not null default 'application/pdf',
  storage_bucket text not null default 'documents',
  status text not null default 'uploaded' check (status in ('uploaded', 'processing', 'failed')),
  created_at timestamptz not null default now()
);

-- 2) Index for sorting by newest first
create index if not exists documents_created_at_idx
  on public.documents (created_at desc);

-- 3) Enable Row Level Security (RLS)
alter table public.documents enable row level security;

-- 4) Allow read access for now (tighten when you add auth)
create policy "Allow public read documents"
  on public.documents
  for select
  using (true);

-- 5) Storage bucket: create in Dashboard → Storage → New bucket
--    Name: documents
--    Public: OFF (private bucket)
--    File size limit: 10 MB
--    Allowed MIME types: application/pdf
--
-- The API uses the service role key server-side, so uploads work without
-- client-side storage policies. When you add auth, update policies accordingly.
