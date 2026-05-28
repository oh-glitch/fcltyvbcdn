import type { SupabaseClient } from "@supabase/supabase-js";
import { getErrorMessage } from "@/lib/api-errors";
import { cleanPdfText } from "@/lib/pdf/clean-text";
import { splitTextIntoChunks } from "@/lib/pdf/chunk-text";
import { extractTextFromPdf } from "@/lib/pdf/extract-text";
import { prepareChunksForEmbeddings } from "@/lib/pdf/prepare-embeddings";
import { generateEmbeddingsForDocument } from "@/lib/rag/generate-embeddings";
import {
  DOCUMENT_CHUNKS_TABLE,
  DOCUMENTS_TABLE
} from "@/lib/supabase/config";
import type { DocumentRecord } from "@/types/document";
import type { ProcessDocumentResult } from "@/types/document-chunk";

/**
 * Full PDF text extraction pipeline for one document.
 *
 * Flow:
 * 1. Download PDF from Supabase Storage
 * 2. Extract raw text
 * 3. Clean formatting
 * 4. Split into chunks
 * 5. Prepare for embeddings
 * 6. Save chunks to PostgreSQL
 * 7. Update document status
 */
export async function processDocumentPipeline(
  supabase: SupabaseClient,
  document: DocumentRecord
): Promise<ProcessDocumentResult> {
  const documentId = document.id;

  await supabase
    .from(DOCUMENTS_TABLE)
    .update({ status: "processing", error_message: null })
    .eq("id", documentId);

  try {
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(document.storage_bucket)
      .download(document.file_path);

    if (downloadError || !fileData) {
      throw new Error(downloadError?.message ?? "Could not download PDF file.");
    }

    const pdfBuffer = Buffer.from(await fileData.arrayBuffer());

    const { rawText, pageCount } = await extractTextFromPdf(pdfBuffer);

    if (!rawText.trim()) {
      throw new Error(
        "No text could be extracted. The PDF may be scanned images only."
      );
    }

    const cleanedText = cleanPdfText(rawText);
    const textChunks = splitTextIntoChunks(cleanedText);

    if (textChunks.length === 0) {
      throw new Error("Text was too short to create chunks after cleaning.");
    }

    const preparedChunks = prepareChunksForEmbeddings(
      documentId,
      document.file_name,
      textChunks
    );

    // Remove old chunks if we are re-processing the same document
    await supabase
      .from(DOCUMENT_CHUNKS_TABLE)
      .delete()
      .eq("document_id", documentId);

    const chunkRows = preparedChunks.map((chunk) => ({
      id: crypto.randomUUID(),
      document_id: documentId,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
      char_count: chunk.charCount,
      token_estimate: chunk.tokenEstimate,
      metadata: chunk.metadata
    }));

    const { error: insertError } = await supabase
      .from(DOCUMENT_CHUNKS_TABLE)
      .insert(chunkRows);

    if (insertError) {
      throw new Error(insertError.message);
    }

    // RAG: generate OpenAI embeddings and store in pgvector
    const embeddedCount = await generateEmbeddingsForDocument(
      supabase,
      documentId
    );

    if (embeddedCount !== preparedChunks.length) {
      throw new Error(
        `Embedding count mismatch: expected ${preparedChunks.length}, got ${embeddedCount}`
      );
    }

    await supabase
      .from(DOCUMENTS_TABLE)
      .update({
        status: "processed",
        page_count: pageCount,
        text_length: cleanedText.length,
        chunk_count: preparedChunks.length,
        processed_at: new Date().toISOString(),
        error_message: null
      })
      .eq("id", documentId);

    return {
      documentId,
      status: "processed",
      pageCount,
      textLength: cleanedText.length,
      chunkCount: preparedChunks.length
    };
  } catch (error) {
    const message = getErrorMessage(error);

    await supabase
      .from(DOCUMENTS_TABLE)
      .update({
        status: "failed",
        error_message: message
      })
      .eq("id", documentId);

    return {
      documentId,
      status: "failed",
      pageCount: 0,
      textLength: 0,
      chunkCount: 0,
      error: message
    };
  }
}
