/** Maximum PDF size: 10 MB */
export const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

export const ALLOWED_PDF_MIME = "application/pdf";

export const ALLOWED_PDF_EXTENSION = ".pdf";

export type ValidationResult =
  | { valid: true; file: File }
  | { valid: false; error: string };

function hasPdfExtension(fileName: string) {
  return fileName.toLowerCase().endsWith(ALLOWED_PDF_EXTENSION);
}

export function validatePdfFile(file: File | null | undefined): ValidationResult {
  if (!file) {
    return { valid: false, error: "Please choose a PDF file to upload." };
  }

  if (!hasPdfExtension(file.name)) {
    return {
      valid: false,
      error: "Only PDF files are allowed (.pdf extension)."
    };
  }

  if (file.type && file.type !== ALLOWED_PDF_MIME) {
    return {
      valid: false,
      error: "Invalid file type. Please upload a PDF (application/pdf)."
    };
  }

  if (file.size === 0) {
    return { valid: false, error: "The file is empty." };
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${MAX_PDF_SIZE_BYTES / (1024 * 1024)} MB.`
    };
  }

  return { valid: true, file };
}

export function sanitizeFileName(fileName: string) {
  const baseName = fileName.split(/[/\\]/).pop() ?? "document.pdf";
  const cleaned = baseName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");

  return cleaned.endsWith(".pdf") ? cleaned : `${cleaned}.pdf`;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
