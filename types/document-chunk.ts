export type DocumentChunkRecord = {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  char_count: number;
  token_estimate: number;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type ProcessDocumentResult = {
  documentId: string;
  status: "processed" | "failed";
  pageCount: number;
  textLength: number;
  chunkCount: number;
  error?: string;
};
