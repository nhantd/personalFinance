"use client";

import { Upload } from "lucide-react";
import { MOCK_UPLOAD_FILE } from "@/lib/marketing/mock-data";

export function MockStepUpload() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 px-3 py-4">
      <div className="flex flex-col items-center text-center">
        <Upload className="h-5 w-5 animate-pulse text-accent" />
        <p className="mt-2 text-xs font-medium text-foreground">Drop CSV or PDF</p>
        <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{MOCK_UPLOAD_FILE}</p>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-2/3 animate-bar-grow rounded-full bg-soft" />
      </div>
    </div>
  );
}
