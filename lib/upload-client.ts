import type { UploadDocumentResponse } from "@/types/document";

/**
 * Uploads a PDF via XMLHttpRequest so we can report real upload progress.
 */
export function uploadPdfWithProgress(
  file: File,
  onProgress: (percent: number) => void
): Promise<UploadDocumentResponse["document"]> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      let payload: { error?: string; document?: UploadDocumentResponse["document"] };

      try {
        payload = JSON.parse(xhr.responseText) as typeof payload;
      } catch {
        reject(new Error("Upload failed: invalid server response."));
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300 && payload.document) {
        resolve(payload.document);
        return;
      }

      reject(new Error(payload.error ?? `Upload failed (${xhr.status})`));
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error while uploading. Check your connection."));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload was cancelled."));
    });

    xhr.open("POST", "/api/documents/upload");
    xhr.send(formData);
  });
}
