"use client";

import type { ChatStatus, UIMessage } from "ai";
import { useEffect, useRef } from "react";
import { ChatLoading } from "@/components/chat/chat-loading";
import { ChatMessage } from "@/components/chat/chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatMessages({
  messages,
  status
}: {
  messages: UIMessage[];
  status: ChatStatus;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted";
  const isStreaming = status === "streaming";
  const isError = status === "error";
  const lastMessage = messages[messages.length - 1];
  const showTypingRow =
    !isError &&
    (isLoading || (isStreaming && lastMessage?.role !== "assistant"));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <ScrollArea className="h-full flex-1">
      <div className="mx-auto flex min-h-full max-w-4xl flex-col">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              How can I help with your facilities?
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Ask about lease clauses, maintenance schedules, or building
              compliance. Responses stream in real time.
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            const streaming =
              isLast && message.role === "assistant" && isStreaming;

            return (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={streaming}
              />
            );
          })
        )}

        {showTypingRow ? (
          <div className="flex gap-3 px-4 py-2 md:px-6">
            <div className="w-8 shrink-0" />
            <ChatLoading />
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
