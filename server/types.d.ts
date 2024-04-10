export type BasicDetailsType = {
  id: string;
  name: string;
  avatar: string | null;
  email: string;
};

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
  lastMessageType: string;
  lastMessageTime: string;
  id: string;
  type: "PRIVATE" | "GROUP";
};
