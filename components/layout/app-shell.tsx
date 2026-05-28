"use client";

import type { UIMessage } from "ai";
import { Menu } from "lucide-react";
import { useCallback, useState } from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ConversationSidebar } from "@/components/chat/conversation-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  createConversationId,
  INITIAL_CONVERSATIONS,
  titleFromMessage,
  type Conversation
} from "@/lib/conversations";

export function AppShell() {
  const [conversations, setConversations] =
    useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState(
    INITIAL_CONVERSATIONS[0].id
  );
  const [messageStore, setMessageStore] = useState<Record<string, UIMessage[]>>(
    {}
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleNewChat = () => {
    const id = createConversationId();
    const newConversation: Conversation = {
      id,
      title: "New conversation",
      updatedAt: new Date()
    };

    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(id);
    setMobileNavOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setMobileNavOpen(false);
  };

  const handleMessagesChange = useCallback(
    (conversationId: string, messages: UIMessage[]) => {
      setMessageStore((prev) => ({ ...prev, [conversationId]: messages }));
    },
    []
  );

  const handleFirstUserMessage = useCallback(
    (text: string) => {
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === activeConversationId
            ? {
                ...conversation,
                title: titleFromMessage(text),
                updatedAt: new Date()
              }
            : conversation
        )
      );
    },
    [activeConversationId]
  );

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      <div className="hidden md:flex">
        <ConversationSidebar
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          title="Facility Assistant"
          subtitle="Chat with your property documents"
          leadingSlot={
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open conversations"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <SheetTitle className="sr-only">Conversations</SheetTitle>
                <ConversationSidebar
                  conversations={conversations}
                  activeId={activeConversationId}
                  onSelect={handleSelectConversation}
                  onNewChat={handleNewChat}
                  className="w-full border-0"
                />
              </SheetContent>
            </Sheet>
          }
        />

        <main className="min-h-0 flex-1">
          <ChatInterface
            key={activeConversationId}
            conversationId={activeConversationId}
            initialMessages={messageStore[activeConversationId] ?? []}
            onMessagesChange={handleMessagesChange}
            onFirstUserMessage={handleFirstUserMessage}
          />
        </main>
      </div>
    </div>
  );
}
