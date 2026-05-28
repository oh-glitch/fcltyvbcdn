export type Conversation = {
  id: string;
  title: string;
  updatedAt: Date;
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "lease-review",
    title: "Lease renewal notice period",
    updatedAt: new Date()
  },
  {
    id: "hvac-maintenance",
    title: "HVAC maintenance schedule",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5)
  },
  {
    id: "parking-clause",
    title: "Parking allocation clause",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
  }
];

export function createConversationId() {
  return `chat-${Date.now()}`;
}

export function titleFromMessage(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return "New conversation";
  return trimmed.length > 36 ? `${trimmed.slice(0, 36)}…` : trimmed;
}
