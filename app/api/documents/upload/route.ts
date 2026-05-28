import { jsonError, getErrorMessage } from "@/lib/api-errors";
import { hasSupabaseConfig } from "@/lib/env";
import {
  ALLOWED_PDF_MIME,
  sanitizeFileName,
  validatePdfFile
} from "@/lib/upload-validation";
import { processDocumentPipeline } from "@/lib/pdf/process-document";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { DOCUMENTS_BUCKET, DOCUMENTS_TABLE } from "@/lib/supabase/config";
import type { DocumentRecord } from "@/types/document";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/documents/upload
 * 1. Validate PDF
 * 2. Upload file to Supabase Storage
 * 3. Save metadata row in PostgreSQL
 */
export async function POST(req: Request) {
  if (!hasSupabaseConfig()) {
    return jsonError(
      "Supabase is not configured. Add keys to .env.local and run supabase/schema.sql.",
      503
    );
  }

  let formData: FormData;

  try {
    formData = await req.formData();
  } catch {
    return jsonError("Could not read upload data.", 400);
  }

  const fileEntry = formData.get("file");
  const validation = validatePdfFile(
    fileEntry instanceof File ? fileEntry : null
  );

  if (!validation.valid) {
    return jsonError(validation.error, 400);
  }

  const file = validation.file;
  const documentId = crypto.randomUUID();
  const safeName = sanitizeFileName(file.name);
  const storagePath = `uploads/${documentId}-${safeName}`;

  try {
    const supabase = createSupabaseAdminClient();
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: storageError } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: ALLOWED_PDF_MIME,
        upsert: false
      });

    if (storageError) {
      console.error("[upload storage]", storageError);
      return jsonError(storageError.message, 500);
    }

    const { data: document, error: dbError } = await supabase
      .from(DOCUMENTS_TABLE)
      .insert({
        id: documentId,
        file_name: file.name,
        file_path: storagePath,
        file_size: file.size,
        mime_type: ALLOWED_PDF_MIME,
        storage_bucket: DOCUMENTS_BUCKET,
        status: "uploaded"
      })
      .select("*")
      .single();

    if (dbError) {
      console.error("[upload db]", dbError);
      await supabase.storage.from(DOCUMENTS_BUCKET).remove([storagePath]);
      return jsonError(dbError.message, 500);
    }

    // Run text extraction pipeline (extract → clean → chunk → save)
    const processing = await processDocumentPipeline(
      supabase,
      document as DocumentRecord
    );

    const { data: finalDocument } = await supabase
      .from(DOCUMENTS_TABLE)
      .select("*")
      .eq("id", documentId)
      .single();

    return Response.json(
      {
        document: finalDocument ?? document,
        processing
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[upload]", error);
    return jsonError(getErrorMessage(error), 500);
  }
}
