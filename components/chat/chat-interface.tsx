"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useState } from "react";
import { ChatError } from "@/components/chat/chat-error";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { CHAT_API_PATH } from "@/lib/chat-config";
import { getErrorMessage } from "@/lib/api-errors";

export function ChatInterface({
  conversationId,
  initialMessages = [],
  onMessagesChange,
  onFirstUserMessage
}: {
  conversationId: string;
  initialMessages?: UIMessage[];
  onMessagesChange?: (conversationId: string, messages: UIMessage[]) => void;
  onFirstUserMessage?: (text: string) => void;
}) {
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: CHAT_API_PATH,
        body: { conversationId }
      }),
    [conversationId]
  );

  const { messages, sendMessage, status, stop, error, clearError } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport,
    onError: (chatError) => {
      console.error("[chat client]", chatError);
    }
  });

  useEffect(() => {
    onMessagesChange?.(conversationId, messages);
  }, [conversationId, messages, onMessagesChange]);

  const isLoading = status === "submitted" || status === "streaming";
  const errorMessage = error ? getErrorMessage(error) : null;

  const handleSubmit = () => {
    const text = input.trim();
    if (!text || isLoading) return;

    clearError();

    if (messages.length === 0) {
      onFirstUserMessage?.(text);
    }

    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {errorMessage ? (
        <ChatError message={errorMessage} onDismiss={clearError} />
      ) : null}

      <ChatMessages messages={messages} status={status} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        onStop={stop}
        isLoading={isLoading}
      />
    </div>
  );
}
