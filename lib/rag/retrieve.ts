import type { SupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseConfig } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { searchSimilarChunks } from "@/lib/rag/search";
import type { RagSearchResult } from "@/types/rag";

/**
 * High-level RAG retrieval: embed question → search pgvector → return chunks.
 * Returns empty chunks if Supabase is not configured.
 */
export async function retrieveContextForQuestion(
  question: string,
  supabase?: SupabaseClient
): Promise<RagSearchResult> {
  if (!hasSupabaseConfig()) {
    return { chunks: [], query: question };
  }

  const client = supabase ?? createSupabaseAdminClient();

  try {
    return await searchSimilarChunks(client, question);
  } catch (error) {
    console.error("[rag retrieve]", error);
    return { chunks: [], query: question };
  }
}
