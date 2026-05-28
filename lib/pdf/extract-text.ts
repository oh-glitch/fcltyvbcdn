import { PDFParse } from "pdf-parse";

export type PdfExtractionResult = {
  rawText: string;
  pageCount: number;
};

/**
 * Step 1: Read the PDF binary and pull out plain text.
 * Uses pdf-parse (built on Mozilla's PDF.js).
 */
export async function extractTextFromPdf(
  pdfBuffer: Buffer
): Promise<PdfExtractionResult> {
  const parser = new PDFParse({ data: pdfBuffer });

  try {
    const result = await parser.getText();
    const rawText = result.text ?? "";
    const pageCount = result.pages?.length ?? 0;

    return { rawText, pageCount };
  } finally {
    await parser.destroy();
  }
}
