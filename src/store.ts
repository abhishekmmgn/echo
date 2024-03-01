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

const useCurrentView = create<ViewState>()((set) => ({
  view: "home",
  changeView: (newView: Views) => set(() => ({ view: newView })),
}));

interface SearchState {
  searchTerm: string;
  changesearchTerm: (newSearchTerm: string) => void;
}

const useSearch = create<SearchState>()((set) => ({
  searchTerm: "",
  changesearchTerm: (newSearchTerm: string) =>
    set((state) => ({ searchTerm: state + newSearchTerm })),
}));

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

export { useCurrentView, useSearch, useCurrentConversation };
