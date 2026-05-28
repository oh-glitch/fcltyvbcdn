import { FACILITY_SYSTEM_PROMPT } from "@/lib/chat-config";
import type { RetrievedChunk } from "@/types/rag";

/**
 * Step C of RAG: put retrieved chunks into the system prompt
 * so the model can answer using your documents.
 */
export function buildRagSystemPrompt(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return `${FACILITY_SYSTEM_PROMPT}

---
DOCUMENT CONTEXT: No relevant excerpts were found in uploaded PDFs.

Tell the user you could not find matching content in their documents. You may still answer from general facility management knowledge, but clearly label it as general guidance (not from their files).
`;
  }

  const contextBlock = chunks
    .map(
      (chunk) =>
        `[${chunk.citationIndex}] Document: "${chunk.fileName}" (chunk ${chunk.chunkIndex}, relevance ${(chunk.similarity * 100).toFixed(0)}%)\n${chunk.content}`
    )
    .join("\n\n");

  return `${FACILITY_SYSTEM_PROMPT}

---
DOCUMENT CONTEXT (answer using these excerpts when relevant):

${contextBlock}

---
CITATION RULES (required):
1. When you use facts from an excerpt, cite it inline like [1] or [2].
2. End every answer with a markdown section titled "## Sources" that lists each citation number and file name you used.
3. Only cite sources you actually used.
4. If excerpts do not contain the answer, say so — do not invent lease clauses or maintenance terms.
`;
}

/** Plain list for logging or debugging. */
export function formatSourcesList(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "No sources retrieved.";

  return chunks
    .map(
      (c) =>
        `[${c.citationIndex}] ${c.fileName} (chunk ${c.chunkIndex}, ${(c.similarity * 100).toFixed(0)}% match)`
    )
    .join("\n");
}
