"use client";

import { MessageSquarePlus, PanelLeft } from "lucide-react";
import type { Conversation } from "@/lib/conversations";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  className
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex h-full w-[min(100vw-3rem,18rem)] flex-col border-r bg-muted/20",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 p-3">
        <div>
          <h2 className="text-sm font-semibold">Facility AI</h2>
          <p className="text-xs text-muted-foreground">Conversations</p>
        </div>
        <PanelLeft className="hidden h-4 w-4 text-muted-foreground md:block" />
      </div>

      <div className="px-3 pb-2">
        <Button className="w-full justify-start gap-2" onClick={onNewChat}>
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-2 py-2">
        <div className="space-y-1">
          {conversations.map((conversation) => {
            const isActive = conversation.id === activeId;

            return (
              <Button
                key={conversation.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "h-auto w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left",
                  isActive && "bg-muted"
                )}
                onClick={() => onSelect(conversation.id)}
              >
                <span className="line-clamp-2 w-full text-sm font-medium">
                  {conversation.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(conversation.updatedAt)}
                </span>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
