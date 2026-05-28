"use client";

import { FileUp, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { UploadProgress } from "@/components/documents/upload-progress";
import { Button } from "@/components/ui/button";
import { validatePdfFile } from "@/lib/upload-validation";
import { uploadPdfWithProgress } from "@/lib/upload-client";
import type { DocumentRecord } from "@/types/document";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "success" | "error";

export function DocumentUpload({
  onUploaded,
  disabled
}: {
  onUploaded: (document: DocumentRecord) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [activeFileName, setActiveFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = () => {
    setUploadState("idle");
    setProgress(0);
    setActiveFileName("");
    setErrorMessage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const startUpload = useCallback(
    async (file: File) => {
      const validation = validatePdfFile(file);
      if (!validation.valid) {
        setErrorMessage(validation.error);
        setUploadState("error");
        return;
      }

      setErrorMessage(null);
      setActiveFileName(file.name);
      setUploadState("uploading");
      setProgress(0);

      try {
        const document = await uploadPdfWithProgress(file, setProgress);
        setUploadState("success");
        setProgress(100);
        onUploaded(document);
        setTimeout(reset, 1500);
      } catch (error) {
        setUploadState("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Upload failed."
        );
      }
    },
    [onUploaded]
  );

  const handleFiles = (files: FileList | null) => {
    if (!files?.length || disabled || uploadState === "uploading") return;
    startUpload(files[0]);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled && uploadState !== "uploading") {
            setIsDragging(true);
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 bg-muted/20 hover:border-primary/50 hover:bg-muted/30",
          (disabled || uploadState === "uploading") &&
            "pointer-events-none opacity-60"
        )}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileUp className="h-7 w-7" />
        </div>

        <h3 className="text-lg font-semibold">Drop your PDF here</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Lease agreements, maintenance reports, or inspection PDFs. Max 10 MB.
        </p>

        <Button
          type="button"
          className="mt-5 gap-2"
          disabled={disabled || uploadState === "uploading"}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Choose PDF
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {uploadState === "uploading" ? (
        <UploadProgress percent={progress} fileName={activeFileName} />
      ) : null}

      {uploadState === "success" ? (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
          Upload complete — text extracted, chunked, and saved for embeddings.
        </p>
      ) : null}

      {errorMessage ? (
        <div className="space-y-2">
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={reset}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  );
}
