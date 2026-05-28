/**
 * Step 2: Clean messy PDF text.
 *
 * PDFs often export text with broken lines, extra spaces, and page numbers.
 * This function normalizes the text so chunking and embeddings work better.
 */
export function cleanPdfText(rawText: string): string {
  let text = rawText;

  // Remove null bytes and other control characters (except newlines/tabs)
  text = text.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "");

  // Normalize line endings
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Join words split across lines: "facil-\nity" -> "facility"
  text = text.replace(/(\w)-\n(\w)/g, "$1$2");

  // Remove standalone page numbers (e.g. "12" on its own line)
  text = text.replace(/^\s*\d{1,4}\s*$/gm, "");

  // Collapse 3+ newlines into 2 (paragraph break)
  text = text.replace(/\n{3,}/g, "\n\n");

  // Collapse multiple spaces/tabs on the same line
  text = text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n");

  // Trim whole document
  return text.trim();
}
