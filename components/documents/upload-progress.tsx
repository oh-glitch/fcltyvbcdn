import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function UploadProgress({
  percent,
  fileName,
  className
}: {
  percent: number;
  fileName: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2 rounded-lg border bg-card p-4", className)}>
      <div className="flex items-center justify-between gap-2 text-sm">
        <p className="truncate font-medium">{fileName}</p>
        <span className="shrink-0 text-muted-foreground">{percent}%</span>
      </div>
      <Progress value={percent} />
      <p className="text-xs text-muted-foreground">
        Uploading PDF, then extracting and chunking text…
      </p>
    </div>
  );
}
