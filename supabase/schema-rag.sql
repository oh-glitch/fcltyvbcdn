-- Run AFTER schema-chunks.sql in Supabase SQL Editor
-- Enables pgvector + semantic search for RAG

-- 1) Enable the vector extension
create extension if not exists vector;

-- 2) Add embedding column to chunks (1536 = text-embedding-3-small)
alter table public.document_chunks
  add column if not exists embedding vector(1536);

-- 3) Index for fast similarity search (cosine distance)
-- HNSW works well for small and large datasets in Supabase.
create index if not exists document_chunks_embedding_idx
  on public.document_chunks
  using hnsw (embedding vector_cosine_ops);

-- 4) Similarity search function used by the app
create or replace function public.match_document_chunks(
  query_embedding vector(1536),
  match_threshold float default 0.35,
  match_count int default 5
)
returns table (
  id uuid,
  document_id uuid,
  chunk_index int,
  content text,
  file_name text,
  similarity float
)
language sql stable
as $$
  select
    dc.id,
    dc.document_id,
    dc.chunk_index,
    dc.content,
    d.file_name,
    1 - (dc.embedding <=> query_embedding) as similarity
  from public.document_chunks dc
  inner join public.documents d on d.id = dc.document_id
  where dc.embedding is not null
    and d.status = 'processed'
    and 1 - (dc.embedding <=> query_embedding) > match_threshold
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;
