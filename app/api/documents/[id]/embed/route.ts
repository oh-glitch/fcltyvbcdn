import { jsonError } from "@/lib/api-errors";
import { hasOpenAIKey, hasSupabaseConfig } from "@/lib/env";
import { generateEmbeddingsForDocument } from "@/lib/rag/generate-embeddings";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { DOCUMENTS_TABLE } from "@/lib/supabase/config";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * POST /api/documents/[id]/embed
 * Generate or refresh OpenAI embeddings for a document's chunks.
 */
export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!hasSupabaseConfig()) {
    return jsonError("Supabase is not configured.", 503);
  }

  if (!hasOpenAIKey()) {
    return jsonError("OPENAI_API_KEY is required for embeddings.", 503);
  }

  const { id } = await context.params;

  try {
    const supabase = createSupabaseAdminClient();

    const { data: document, error } = await supabase
      .from(DOCUMENTS_TABLE)
      .select("id, file_name")
      .eq("id", id)
      .single();

    if (error || !document) {
      return jsonError("Document not found.", 404);
    }

    const embeddedCount = await generateEmbeddingsForDocument(supabase, id);

    return Response.json({
      documentId: id,
      fileName: document.file_name,
      embeddedCount,
      message: `Generated embeddings for ${embeddedCount} chunks.`
    });
  } catch (error) {
    console.error("[embed]", error);
    return jsonError(
      error instanceof Error ? error.message : "Embedding generation failed.",
      500
    );
  }
}
