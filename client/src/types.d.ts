import type { Socket } from "socket.io";

// export type MyChatSocket = Socket<
//   ChatSocket.ListenEvents,
//   ChatSocket.EmitEvents
// >;
// export interface ChatSocketCtxState {
//   socket: MyChatSocket;
// }

// declare namespace ChatSocket {
//   interface EmitEvents {}
//   interface ListenEvents {}
// }

export type SocketStateType = {
  socket: Socket;
};

export type UserType = {
  uid: string;
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
  lastMessageTime: string;
  lastMessageType: "TEXT" | "IMAGE" | "FILE";
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

type CallStateType = {
  callId: string | null;
  name: string | null;
  avatar: string | null;
  email: string | null;
  participants: string[];
  callType: "PRIVATE" | "GROUP" | null;
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
