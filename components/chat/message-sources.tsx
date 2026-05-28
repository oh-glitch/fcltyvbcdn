import { FileText } from "lucide-react";

/**
 * Parses the "## Sources" section from the assistant markdown response.
 */
export function parseSourcesSection(text: string): {
  body: string;
  sources: string | null;
} {
  const marker = "\n## Sources\n";
  const altMarker = "\n## Sources\r\n";
  let index = text.indexOf(marker);

  if (index === -1) {
    index = text.indexOf(altMarker);
    if (index !== -1) {
      return {
        body: text.slice(0, index).trim(),
        sources: text.slice(index + altMarker.length).trim()
      };
    }
    return { body: text, sources: null };
  }

  return {
    body: text.slice(0, index).trim(),
    sources: text.slice(index + marker.length).trim()
  };
}

export function MessageSources({ sources }: { sources: string }) {
  const lines = sources
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  return (
    <div className="mt-3 rounded-lg border bg-muted/40 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <FileText className="h-3.5 w-3.5" />
        Document sources
      </div>
      <ul className="space-y-1 text-xs text-muted-foreground">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
