import { jsonError } from "@/lib/api-errors";
import { hasSupabaseConfig } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { DOCUMENTS_TABLE } from "@/lib/supabase/config";

/** GET /api/documents — list uploaded document metadata from PostgreSQL */
export async function GET() {
  if (!hasSupabaseConfig()) {
    return jsonError(
      "Supabase is not configured. See supabase/SETUP.md and .env.example.",
      503
    );
  }

  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from(DOCUMENTS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[documents GET]", error);
      return jsonError(error.message, 500);
    }

    return Response.json({ documents: data ?? [] });
  } catch (error) {
    console.error("[documents GET]", error);
    return jsonError(
      error instanceof Error ? error.message : "Failed to load documents.",
      500
    );
  }
}
