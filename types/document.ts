export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "processed"
  | "failed";

export type DocumentRecord = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  storage_bucket: string;
  status: DocumentStatus;
  created_at: string;
  page_count?: number | null;
  text_length?: number | null;
  chunk_count?: number | null;
  processed_at?: string | null;
  error_message?: string | null;
};

export type UploadDocumentResponse = {
  document: DocumentRecord;
};
