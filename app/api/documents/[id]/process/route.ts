import { jsonError } from "@/lib/api-errors";
import { hasSupabaseConfig } from "@/lib/env";
import { processDocumentPipeline } from "@/lib/pdf/process-document";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { DOCUMENTS_TABLE } from "@/lib/supabase/config";
import type { DocumentRecord } from "@/types/document";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/documents/[id]/process
 * Manually re-run the PDF extraction pipeline for one document.
 */
export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!hasSupabaseConfig()) {
    return jsonError("Supabase is not configured.", 503);
  }

  const { id } = await context.params;

  if (!id) {
    return jsonError("Document id is required.", 400);
  }

  try {
    const supabase = createSupabaseAdminClient();

    const { data: document, error } = await supabase
      .from(DOCUMENTS_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !document) {
      return jsonError("Document not found.", 404);
    }

    const result = await processDocumentPipeline(
      supabase,
      document as DocumentRecord
    );

    const { data: updated } = await supabase
      .from(DOCUMENTS_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    return Response.json({
      document: updated,
      processing: result
    });
  } catch (error) {
    console.error("[process]", error);
    return jsonError(
      error instanceof Error ? error.message : "Processing failed.",
      500
    );
  }
}
