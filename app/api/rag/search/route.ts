import { jsonError } from "@/lib/api-errors";
import { hasOpenAIKey, hasSupabaseConfig } from "@/lib/env";
import { formatSourcesList } from "@/lib/rag/build-prompt";
import { retrieveContextForQuestion } from "@/lib/rag/retrieve";

export const runtime = "nodejs";

/**
 * POST /api/rag/search
 * Debug endpoint: run semantic search and return matching chunks.
 */
export async function POST(req: Request) {
  if (!hasSupabaseConfig() || !hasOpenAIKey()) {
    return jsonError("Supabase and OPENAI_API_KEY are required.", 503);
  }

  let body: { query?: string };

  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const query = body.query?.trim();
  if (!query) {
    return jsonError("query is required.", 400);
  }

  try {
    const result = await retrieveContextForQuestion(query);

    return Response.json({
      query: result.query,
      chunkCount: result.chunks.length,
      chunks: result.chunks,
      sourcesList: formatSourcesList(result.chunks)
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Search failed.",
      500
    );
  }
}
