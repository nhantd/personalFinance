import { getPath } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import type { ParsedTransaction } from "@/lib/types/database";

PDFParse.setWorker(getPath());

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

export function pdfNeedsLlmFallback(text: string): boolean {
  return text.trim().length < 50;
}

export type { ParsedTransaction };
