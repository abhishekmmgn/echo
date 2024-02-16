import { MdMenu, MdClose, MdChevronLeft, MdAdd } from "react-icons/md";
import { Input } from "../ui/input";
import { useCurrentView, useSearch } from "@/store";

export default function NavbarWrapper({
  height,
  children,
}: {
  height: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-x-0 top-0 z-20 w-full flex flex-col justify-end gap-5 px-5 pb-5 bg-background backdrop-filter backdrop-blur-xl bg-opacity-80 border-b dark:bg-background md:sticky"
      style={{
        height: height,
      }}
    >
      {children}
    </div>
  );
}

export function SettingsNavbar() {
  const { changeView } = useCurrentView();
  return (
    <>
      <div className="flex items-center justify-between">
        <MdClose
          className="w-6 h-6 cursor-pointer"
          onClick={() => changeView("home")}
        />
        <p className="text-primary font-medium md:text-base+">Echo</p>
        <MdClose className="invisible" />
      </div>
    </>
  );
}

export function NewNavbar() {
  const { changeView } = useCurrentView();
  return (
    <>
      <div className="flex items-center justify-between">
        <MdClose
          className="w-6 h-6 cursor-pointer"
          onClick={() => changeView("home")}
        />
        <p className="text-primary font-medium md:text-base+">Echo</p>
        <MdClose className="invisible" />
      </div>
    </>
  );
}

export function DefaultNavbar() {
  const { changesearchTerm } = useSearch();
  const { view, changeView } = useCurrentView();
  return (
    <>
      <div className="flex items-center justify-between">
        <MdMenu
          className="w-6 h-6 cursor-pointer"
          onClick={() => changeView("settings")}
        />
        <p className="text-primary font-medium md:text-base+">Echo</p>
        <MdAdd
          className="w-6 h-6 cursor-pointer"
          onClick={() => changeView("new")}
        />
      </div>
      <div className="w-full flex gap-2">
        {view === "search" && (
          <MdChevronLeft
            className="w-8 h-8 mt-1 cursor-pointer"
            onClick={() => changeView("home")}
          />
        )}
        <Input
          type="search"
          placeholder="Search for conversations, people and files"
          className="bg-accent"
          onChange={(e) => changesearchTerm(e.target.value)}
          onClick={() => changeView("search")}
        />
      </div>
    </>
  );
}
