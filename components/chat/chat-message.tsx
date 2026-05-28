"use client";

import type { UIMessage } from "ai";
import { Bot, User } from "lucide-react";
import {
  MessageSources,
  parseSourcesSection
} from "@/components/chat/message-sources";
import { MarkdownContent } from "@/components/chat/markdown-content";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getMessageText } from "@/lib/chat-utils";

export function ChatMessage({
  message,
  isStreaming = false
}: {
  message: UIMessage;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "user";
  const text = getMessageText(message);
  const parsed =
    !isUser && text ? parseSourcesSection(text) : { body: text, sources: null };

  if (!text && !isStreaming) {
    return null;
  }

  return (
    <div
      className={cn(
        "group flex w-full gap-3 px-4 py-5 md:px-6",
        isUser ? "bg-muted/30" : "bg-transparent"
      )}
    >
      <Avatar className="mt-0.5 h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-emerald-600 text-white dark:bg-emerald-500"
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-xs font-medium text-muted-foreground">
          {isUser ? "You" : "Facility AI"}
        </p>

        <div
          className={cn(
            "max-w-3xl text-sm leading-relaxed",
            isUser && "whitespace-pre-wrap"
          )}
        >
          {isUser ? (
            <p>{text}</p>
          ) : (
            <>
              <MarkdownContent content={parsed.body || " "} />
              {parsed.sources && !isStreaming ? (
                <MessageSources sources={parsed.sources} />
              ) : null}
            </>
          )}
          {isStreaming && !text ? (
            <span className="inline-block h-4 w-0.5 animate-pulse bg-foreground" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
