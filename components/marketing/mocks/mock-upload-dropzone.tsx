import { Upload } from "lucide-react";
import { brandClasses } from "@/lib/brand";

export function MockUploadDropzone() {
  return (
    <div className={`${brandClasses.card} p-4`}>
      <div className="flex flex-col items-center rounded-lg border-2 border-dashed border-border bg-muted/40 px-4 py-6 text-center">
        <Upload className="h-6 w-6 text-accent" />
        <p className="mt-2 text-sm font-medium text-foreground">Drop CSV or PDF</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">chase-checking-jun.csv</p>
      </div>
    </div>
  );
}
