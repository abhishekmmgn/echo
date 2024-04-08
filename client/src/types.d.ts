export type ContactType = {
  name: string;
  avatar: string | null;
  email: string;
  id: string;
  blocked: boolean;
  hasConversation: boolean;
};

export type GroupType = {
  name: string;
  avatar: string | null;
  id: string;
};

export type FileType = {
  name: string;
  size?: number;
};

export type ConversationType = {
  name: string;
  avatar: string | null;
  lastMessage: string;
  date: Date;
  unreadMessages: number;
  id: string;
  type: "private" | "group";
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
  time: Date | string;
  type: "TEXT" | "FILE" | "IMAGE" | "CALL";
  senderId: string;
  name: string;
  avatar: string | null;
};
