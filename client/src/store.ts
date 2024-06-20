import { create } from "zustand";
import { ConversationStateType } from "./types";
import { noConversation } from "./lib/utils";

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
    set(() => ({ searchTerm: newSearchTerm })),
}));

interface ConversationStateInterface {
  conversation: ConversationStateType;
  changeCurrentConversation: (newConversation: ConversationStateType) => void;
}
const useCurrentConversation = create<ConversationStateInterface>()((set) => ({
  conversation: noConversation,
  changeCurrentConversation: (newConversation: ConversationStateType) =>
    set(() => ({ conversation: newConversation })),
}));

interface CurrentUserState {
  uid: string;
  name: string;
  avatar: string | null;
  email: string;
  changeCurrentUser: (
    newUID: string,
    newName: string,
    newAvatar: string | null,
    newEmail: string
  ) => void;
}
const useCurrentUser = create<CurrentUserState>()((set) => ({
  uid: "",
  name: "",
  avatar: "",
  email: "",
  changeCurrentUser: (
    newUID: string,
    newName: string,
    newAvatar: string | null,
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
