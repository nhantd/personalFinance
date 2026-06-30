import type { ParsedTransaction } from "@/lib/types/database";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

export function pdfNeedsLlmFallback(text: string): boolean {
  return text.trim().length < 50;
}

export type { ParsedTransaction };
