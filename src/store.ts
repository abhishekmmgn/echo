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
  view: "calls",
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

export { useCurrentView, useSearch };
