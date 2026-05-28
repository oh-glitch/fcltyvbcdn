import { embedMany } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getOpenAIProvider } from "@/lib/openai";
import { RAG_EMBEDDING_MODEL } from "@/lib/rag/config";
import { DOCUMENT_CHUNKS_TABLE } from "@/lib/supabase/config";

const BATCH_SIZE = 50;

/**
 * Step A of RAG: turn each text chunk into a vector using OpenAI embeddings.
 * Vectors are saved in the `embedding` column (pgvector).
 */
export async function generateEmbeddingsForDocument(
  supabase: SupabaseClient,
  documentId: string
): Promise<number> {
  const { data: chunks, error } = await supabase
    .from(DOCUMENT_CHUNKS_TABLE)
    .select("id, content")
    .eq("document_id", documentId)
    .order("chunk_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!chunks?.length) {
    return 0;
  }

  const openai = getOpenAIProvider();
  let embeddedCount = 0;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const { embeddings } = await embedMany({
      model: openai.embedding(RAG_EMBEDDING_MODEL),
      values: batch.map((chunk) => chunk.content)
    });

    for (let j = 0; j < batch.length; j++) {
      const { error: updateError } = await supabase
        .from(DOCUMENT_CHUNKS_TABLE)
        .update({ embedding: embeddings[j] })
        .eq("id", batch[j].id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      embeddedCount += 1;
    }
  }

  return embeddedCount;
}
