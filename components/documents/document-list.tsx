"use client";

import { FileText, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFileSize } from "@/lib/upload-validation";
import type { DocumentRecord } from "@/types/document";
import { cn } from "@/lib/utils";

function statusLabel(status: DocumentRecord["status"]) {
  switch (status) {
    case "processed":
      return "Processed";
    case "processing":
      return "Processing…";
    case "failed":
      return "Failed";
    default:
      return "Uploaded";
  }
}

function statusClass(status: DocumentRecord["status"]) {
  switch (status) {
    case "processed":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    case "processing":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
    case "failed":
      return "bg-destructive/15 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function DocumentList({
  refreshKey = 0,
  className
}: {
  refreshKey?: number;
  className?: string;
}) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/documents");
      const payload = (await response.json()) as {
        documents?: DocumentRecord[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load documents.");
      }

      setDocuments(payload.documents ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load documents."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments, refreshKey]);

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base">Uploaded documents</CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={loadDocuments}
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading documents…
          </div>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {!isLoading && !error && documents.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No documents yet. Upload your first PDF above.
          </p>
        ) : null}

        {!isLoading && !error && documents.length > 0 ? (
          <ul className="divide-y rounded-lg border">
            {documents.map((document) => (
              <li
                key={document.id}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{document.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(document.file_size)} ·{" "}
                    {new Date(document.created_at).toLocaleString()}
                    {document.chunk_count != null && document.chunk_count > 0
                      ? ` · ${document.chunk_count} chunks`
                      : ""}
                  </p>
                  {document.error_message ? (
                    <p className="mt-1 text-xs text-destructive">
                      {document.error_message}
                    </p>
                  ) : null}
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                    statusClass(document.status)
                  )}
                >
                  {statusLabel(document.status)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
