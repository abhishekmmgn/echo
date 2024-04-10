import { MdMenu, MdClose, MdChevronLeft, MdAdd } from "react-icons/md";
import { Input } from "./ui/input";
import { useCurrentView, useSearch, useCurrentConversation } from "@/store";
import { noConversation } from "@/lib/utils";

export function Header({ title }: { title: string }) {
  return (
    <div className="sticky top-0 inset-x-0 h-14 flex items-center justify-center">
      <p className="text-lg md:text-lg+ text-primary font-semibold">{title}</p>
    </div>
  );
}

export function Navbar() {
  const { searchTerm, changesearchTerm } = useSearch();
  const { view, changeView } = useCurrentView();
  const { changeCurrentConversation } = useCurrentConversation();
  return (
    <div
      className={`fixed inset-x-0 top-0 z-20 w-full flex flex-col justify-end gap-5 px-4 pb-5 bg-background/70 backdrop-filter backdrop-blur-xl bg-opacity-80 border-b md:sticky ${
        view === "settings" || view === "new" ? "h-16" : "h-32"
      }`}
    >
      <div className="flex items-center justify-between">
        {view === "settings" || view === "new" ? (
          <>
            <MdClose
              className="w-6 h-6 cursor-pointer"
              onClick={() => {
                changeCurrentConversation(noConversation);
                changeView("home");
              }}
            />
          </>
        ) : (
          <>
            <MdMenu
              className="w-6 h-6 cursor-pointer"
              onClick={() => changeView("settings")}
            />
          </>
        )}
        <p
          className="text-primary font-medium md:text-base+ cursor-pointer"
          onClick={() => changeView("home")}
        >
          Echo
        </p>
        <MdAdd
          className={`w-6 h-6 cursor-pointer ${
            (view === "settings" || view === "new") && "invisible"
          }`}
          onClick={() => changeView("new")}
        />
      </div>
      {view !== "settings" && view !== "new" && (
        <div className="w-full flex gap-2">
          {view === "search" && (
            <MdChevronLeft
              className="w-8 h-8 mt-1 cursor-pointer"
              onClick={() => {
                changesearchTerm("");
                changeView("home");
              }}
            />
          )}
          <div className="flex w-full items-center relative">
            <Input
              type="search"
              value={searchTerm}
              placeholder="Search for conversations, people and files"
              className="bg-accent"
              onChange={(e) => changesearchTerm(e.target.value)}
              onClick={() => changeView("search")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
