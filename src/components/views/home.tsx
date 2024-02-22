import { useCurrentView } from "@/store";
import Search from "./search";
import Settings from "./settings";
import Conversations from "./conversations";
import New from "./new";
import MessageRoom from "./message-room";
import Details from "./details";
import Calls from "./calls";
import NotFound from "./not-found";
import Navbar from "../navigation/navbar";

export default function Home() {
  const { view } = useCurrentView();
  return (
    <div className="grid md:grid-cols-[2fr_3fr] lg:grid-cols-[1fr_2fr] no-scrollbar">
      <div className="h-screen no-scrollbar md:border-r">
        <Navbar />
        <div
          className={`${
            view === "settings" || view === "new" ? "pt-16" : "pt-32"
          } md:pt-0`}
        >
          {view === "home" && <Conversations />}
          {view === "search" && <Search />}
          {view === "settings" && <Settings />}
          {view === "new" && <New />}
          {view === "message-room" && <MessageRoom />}
          {view === "details" && <Details />}
          {view === "calls" && <Calls />}
          {view !== "home" &&
            view !== "search" &&
            view !== "settings" &&
            view !== "calls" &&
            view !== "details" &&
            view !== "message-room" &&
            view !== "new" && <NotFound />}
        </div>
      </div>
      <div className="hidden h-full w-full md:grid">
        {view === "message-room" && <MessageRoom />}
        {view === "details" && <Details />}
        {view === "calls" && <Calls />}
        {view !== "home" &&
          view !== "search" &&
          view !== "settings" &&
          view !== "calls" &&
          view !== "details" &&
          view !== "message-room" &&
          view !== "new" && (
            <div className="">
              <p>blank</p>
            </div>
          )}
      </div>
    </div>
  );
}
