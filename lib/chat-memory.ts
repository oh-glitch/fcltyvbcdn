import type { UIMessage } from "ai";
import { MAX_MEMORY_MESSAGES } from "@/lib/chat-config";

/**
 * Keeps only the most recent messages so the model gets short-term memory
 * without sending an unbounded history (saves tokens and cost).
 */
export function trimMessagesForMemory(messages: UIMessage[]): UIMessage[] {
  if (messages.length <= MAX_MEMORY_MESSAGES) {
    return messages;
  }

  return messages.slice(-MAX_MEMORY_MESSAGES);
}
