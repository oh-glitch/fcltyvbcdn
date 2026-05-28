/** OpenAI embedding model (1536 dimensions for pgvector). */
export const RAG_EMBEDDING_MODEL = "text-embedding-3-small";

export const RAG_EMBEDDING_DIMENSIONS = 1536;

/** How many chunks to retrieve per question. */
export const RAG_TOP_K = 5;

/**
 * Minimum similarity score (0–1).
 * Higher = stricter matching. Lower = more results.
 */
export const RAG_MATCH_THRESHOLD = 0.35;
