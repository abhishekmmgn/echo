export type ContactType = {
  name: string;
  avatar: string | undefined;
  username: string;
  id: string;
};

export type GroupType = {
  name: string;
  avatar: string | undefined;
  id: string;
};

export type FileType = {
  name: string;
  size?: number;
};

export type ConversationType = {
  name: string;
  avatar: string;
  message: string;
  date: Date;
  unreadMessages: number;
  id: string;
  type: "personal" | "group";
};
