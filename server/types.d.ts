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
  id: string;
  name: string | null;
  avatar: string | null;
  lastMessage: string;
  date: Date;
  unreadMessages: number;
  type: "PRIVATE" | "GROUP";
  participants: ContactType[];
  createdBy: string;
};
