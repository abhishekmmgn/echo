import { create } from "zustand";
import { noCall, noConversation } from "./lib/utils";
import { CallStateType, ConversationStateType, UserType } from "./types";

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
  currentConversation: ConversationStateType;
  changeCurrentConversation: (newConversation: ConversationStateType) => void;
}
const useCurrentConversation = create<ConversationStateInterface>()((set) => ({
  currentConversation: noConversation,
  changeCurrentConversation: (newConversation: ConversationStateType) =>
    set(() => ({ currentConversation: newConversation })),
}));

interface CallStateInterface {
  currentCall: CallStateType;
  changeCurrentCall: (newCall: CallStateType) => void;
}
const useCurrentCall = create<CallStateInterface>()((set) => ({
  currentCall: noCall,
  changeCurrentCall: (newCall: CallStateType) =>
    set(() => ({ currentCall: newCall })),
}));

interface CurrentUserState {
  currentUser: UserType;
  changeCurrentUser: (newUser: UserType) => void;
}
const useCurrentUser = create<CurrentUserState>()((set) => ({
  currentUser: {
    uid: "",
    name: "",
    avatar: null,
    email: "",
  },
  changeCurrentUser: (newUser: UserType) =>
    set(() => ({ currentUser: newUser })),
}));

export {
  useCurrentView,
  useSearch,
  useCurrentConversation,
  useCurrentUser,
  useCurrentCall,
};
