"use client";

import { ArrowUp, Square } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading,
  className
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isLoading?: boolean;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className={cn("border-t bg-background px-4 py-4 md:px-6", className)}>
      <div className="mx-auto max-w-4xl">
        <div className="relative flex items-end gap-2 rounded-2xl border bg-muted/30 p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/30">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Facility AI..."
            rows={1}
            disabled={isLoading}
            className="max-h-[200px] min-h-[44px] resize-none border-0 bg-transparent px-3 py-2.5 shadow-none focus-visible:ring-0"
          />

          {isLoading ? (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="mb-1 shrink-0 rounded-xl"
              onClick={onStop}
              aria-label="Stop generating"
            >
              <Square className="h-4 w-4 fill-current" />
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              className="mb-1 shrink-0 rounded-xl"
              disabled={!value.trim()}
              onClick={onSubmit}
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Answers use your uploaded PDFs (RAG) with source citations · Enter to
          send
        </p>
      </div>
    </div>
  );
}
