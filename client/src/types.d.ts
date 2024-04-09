export type ContactType = {
  name: string;
  avatar: string | null;
  email: string;
  id: string;
  blocked: boolean;
  hasConversation: boolean;
};

export type ConversationType = {
  name: string;
  avatar: string | null;
  lastMessage: string;
  time: string;
  id: string;
  type: "PRIVATE" | "GROUP";
};

type ConversationStateType = {
  conversationId: string | null;
  name: string | null;
  avatar: string | null;
  email: string | null;
  participants: string[];
  conversationType: "PRIVATE" | "GROUP" | null;
  hasConversation: boolean | null;
};

export type BasicDetailsType = {
  id: string;
  name: string;
  avatar: string | null;
  email: string;
};

export type MessageType = {
  id: string;
  content: string;
  time: string;
  type: "TEXT" | "FILE" | "IMAGE" | "CALL";
  senderId: string;
  name: string;
  avatar: string | null;
};
