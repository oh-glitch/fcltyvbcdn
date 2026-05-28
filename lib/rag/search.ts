import { embed } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getOpenAIProvider } from "@/lib/openai";
import {
  RAG_EMBEDDING_MODEL,
  RAG_MATCH_THRESHOLD,
  RAG_TOP_K
} from "@/lib/rag/config";
import type { RetrievedChunk, RagSearchResult } from "@/types/rag";

type MatchRow = {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  file_name: string;
  similarity: number;
};

/**
 * Step B of RAG: find chunks most similar to the user's question.
 * Uses pgvector cosine similarity via Supabase RPC.
 */
export async function searchSimilarChunks(
  supabase: SupabaseClient,
  query: string,
  options?: { topK?: number; threshold?: number }
): Promise<RagSearchResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { chunks: [], query: "" };
  }

  const openai = getOpenAIProvider();
  const { embedding } = await embed({
    model: openai.embedding(RAG_EMBEDDING_MODEL),
    value: trimmed
  });

  const { data, error } = await supabase.rpc("match_document_chunks", {
    query_embedding: embedding,
    match_threshold: options?.threshold ?? RAG_MATCH_THRESHOLD,
    match_count: options?.topK ?? RAG_TOP_K
  });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as MatchRow[];

  const chunks: RetrievedChunk[] = rows.map((row, index) => ({
    id: row.id,
    documentId: row.document_id,
    chunkIndex: row.chunk_index,
    content: row.content,
    fileName: row.file_name,
    similarity: row.similarity,
    citationIndex: index + 1
  }));

  return { chunks, query: trimmed };
}
