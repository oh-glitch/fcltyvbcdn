import {
  CHUNK_OVERLAP_CHARS,
  CHUNK_SIZE_CHARS,
  MIN_CHUNK_CHARS
} from "@/lib/pdf/chunk-config";

/**
 * Step 3: Split long text into smaller overlapping chunks.
 *
 * Why chunks?
 * - Embedding models have token limits
 * - RAG search works better on focused passages
 * - Overlap helps when a sentence spans two chunks
 */
export function splitTextIntoChunks(
  text: string,
  chunkSize = CHUNK_SIZE_CHARS,
  overlap = CHUNK_OVERLAP_CHARS
): string[] {
  const normalized = text.trim();
  if (!normalized) {
    return [];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < normalized.length) {
    let end = Math.min(start + chunkSize, normalized.length);

    // Try to break at a space so we don't cut words in half
    if (end < normalized.length) {
      const lastSpace = normalized.lastIndexOf(" ", end);
      if (lastSpace > start + chunkSize * 0.5) {
        end = lastSpace;
      }
    }

    const chunk = normalized.slice(start, end).trim();
    if (chunk.length >= MIN_CHUNK_CHARS) {
      chunks.push(chunk);
    }

    if (end >= normalized.length) {
      break;
    }

    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}
