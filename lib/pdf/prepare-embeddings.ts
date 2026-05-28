/**
 * Step 4: Shape each chunk for embedding + database storage.
 *
 * We don't call OpenAI embeddings yet — that is the next feature.
 * This step prepares clean records that are ready for `embeddings.create()`.
 */

export type PreparedChunk = {
  chunkIndex: number;
  content: string;
  charCount: number;
  tokenEstimate: number;
  metadata: {
    documentId: string;
    fileName: string;
    chunkIndex: number;
    source: "pdf";
    readyForEmbedding: true;
  };
};

/** Rough token estimate: ~4 characters per token for English text. */
export function estimateTokenCount(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

export function prepareChunksForEmbeddings(
  documentId: string,
  fileName: string,
  textChunks: string[]
): PreparedChunk[] {
  return textChunks.map((content, chunkIndex) => ({
    chunkIndex,
    content,
    charCount: content.length,
    tokenEstimate: estimateTokenCount(content),
    metadata: {
      documentId,
      fileName,
      chunkIndex,
      source: "pdf",
      readyForEmbedding: true
    }
  }));
}
