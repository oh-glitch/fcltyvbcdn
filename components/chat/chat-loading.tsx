import { cn } from "@/lib/utils";

export function ChatLoading({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5 px-1 py-2", className)}>
      <span className="sr-only">Assistant is typing</span>
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/70"
          style={{ animationDelay: `${dot * 150}ms` }}
        />
      ))}
    </div>
  );
}
