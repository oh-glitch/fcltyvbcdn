/** A chunk returned from semantic search, ready for the AI prompt. */
export type RetrievedChunk = {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  fileName: string;
  similarity: number;
  /** Citation number shown to the user as [1], [2], … */
  citationIndex: number;
};

export type RagSearchResult = {
  chunks: RetrievedChunk[];
  query: string;
};
