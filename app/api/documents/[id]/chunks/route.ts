import { jsonError } from "@/lib/api-errors";
import { hasSupabaseConfig } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { DOCUMENT_CHUNKS_TABLE } from "@/lib/supabase/config";

/** GET /api/documents/[id]/chunks — list saved text chunks for a document */
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!hasSupabaseConfig()) {
    return jsonError("Supabase is not configured.", 503);
  }

  const { id } = await context.params;

  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from(DOCUMENT_CHUNKS_TABLE)
      .select("id, document_id, chunk_index, char_count, token_estimate, created_at")
      .eq("document_id", id)
      .order("chunk_index", { ascending: true });

    if (error) {
      return jsonError(error.message, 500);
    }

    return Response.json({ chunks: data ?? [] });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Failed to load chunks.",
      500
    );
  }
}
