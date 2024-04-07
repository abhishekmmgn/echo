import { create } from "zustand";

type Views =
  | "home"
  | "search"
  | "calls"
  | "details"
  | "message-room"
  | "settings"
  | "new";

interface ViewState {
  view: Views;
  changeView: (newView: Views) => void;
}

interface SearchState {
  searchTerm: string;
  changesearchTerm: (newSearchTerm: string) => void;
}
interface ConversationState {
  conversationId: string;
  name: string;
  avatar: string;
  conversationType: "personal" | "group" | undefined;
  changeCurrentConversation: (
    newId: string,
    newName: string,
    newAvatar: string,
    conversationType: "personal" | "group" | undefined
  ) => void;
}

interface CurrentUserState {
  uid: string;
  name: string;
  avatar: string;
  email: string;
  changeCurrentUser: (
    newUID: string,
    newName: string,
    newAvatar: string,
    newEmail: string
  ) => void;
}

const useCurrentView = create<ViewState>()((set) => ({
  view: "home",
  changeView: (newView: Views) => set(() => ({ view: newView })),
}));
const useSearch = create<SearchState>()((set) => ({
  searchTerm: "",
  changesearchTerm: (newSearchTerm: string) =>
    set(() => ({ searchTerm: newSearchTerm })),
}));

const useCurrentConversation = create<ConversationState>()((set) => ({
  conversationId: "",
  name: "",
  avatar: "",
  conversationType: undefined,
  changeCurrentConversation: (
    newId: string,
    newName: string,
    newAvatar: string,
    type: "personal" | "group" | undefined
  ) =>
    set(() => ({
      conversationId: newId,
      name: newName,
      avatar: newAvatar,
      conversationType: type,
    })),
}));

const useCurrentUser = create<CurrentUserState>()((set) => ({
  uid: "",
  name: "",
  avatar: "",
  email: "",
  changeCurrentUser: (
    newUID: string,
    newName: string,
    newAvatar: string,
    newEmail: string
  ) =>
    set(() => ({
      uid: newUID,
      name: newName,
      avatar: newAvatar,
      email: newEmail,
    })),
}));

export { useCurrentView, useSearch, useCurrentConversation, useCurrentUser };
