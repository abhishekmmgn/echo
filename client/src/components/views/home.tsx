import { PeerProvider } from "@/lib/peer-provider";
import { useSocket } from "@/lib/socket-provider";
import { getId, noCall } from "@/lib/utils";
import { useCurrentCall, useCurrentView } from "@/store";
import { Suspense, lazy, useEffect } from "react";
import { DefaultSkeleton } from "../default-loading";
import { Navbar } from "../navigation";

const Calls = lazy(() => import("./calls"));
const MessageRoom = lazy(() => import("./message-room"));
const Details = lazy(() => import("./details"));
const Conversations = lazy(() => import("./conversations"));
const Settings = lazy(() => import("./settings"));
const Search = lazy(() => import("./search"));
const DefaultView = lazy(() => import("./default-view"));
const CallNotification = lazy(() => import("@/components/call-notification"));
const New = lazy(() => import("./new"));
const NotFound = lazy(() => import("./not-found"));

export default function Home() {
  const { view } = useCurrentView();
  const { socket } = useSocket();
  const { currentCall, changeCurrentCall } = useCurrentCall();

  useEffect(() => {
    socket.emit("setId", getId());
    return () => {
      socket.emit("removeId", getId());
      socket.off("uid-to-socketId");
    };
  }, []);

  // Current behaviour: Person will only be able to take call if it was active in the application while other user called.
  useEffect(() => {
    socket.on("cancelled:call", () => {
      console.log("Call cancelled by other user");
      changeCurrentCall(noCall);
    });
    socket.on(
      "incomming:call",
      (data: {
        avatar: string | null;
        name: string;
        conversationId: string;
        offer: RTCSessionDescriptionInit;
      }) => {
        changeCurrentCall({
          ...currentCall,
          callId: data.conversationId,
          avatar: data.avatar,
          name: data.name,
          offer: data.offer,
        });
      },
    );
    return () => {
      socket.off("incomming:call");
      socket.off("call-cancelled");
    };
  }, []);
  // console.log(`View: ${view}, Current conversation: ${currentConversation.name}`)
  return (
    <Suspense fallback={<DefaultSkeleton />}>
      <PeerProvider>
        <div className="min-h-screen grid md:grid-cols-[1fr_1.3fr] lg:grid-cols-[2fr_3fr] xl:grid-cols-[1fr_2fr]">
          <div className="md:border-r">
            {view !== "calls" &&
              view !== "details" &&
              view !== "message-room" && (
                <div className="md:hidden">
                  <Navbar />
                </div>
              )}
            <div className="hidden md:inline">
              <Navbar />
            </div>
            <div
              className={`${
                view === "settings" || view === "new" || view === "details"
                  ? "pt-16"
                  : "pt-32"
              } md:pt-0`}
            >
              {view !== "message-room" && view !== "calls" && (
                <CallNotification />
              )}
              {view === "home" && <Conversations />}
              {view === "search" && <Search />}
              {view === "settings" && <Settings />}
              {view === "new" && <New />}
              <div className="md:hidden">
                {view === "details" && <Details />}
                {view === "message-room" && <MessageRoom />}
                {view === "calls" && <Calls />}
              </div>
              <div className="hidden md:grid">
                {(view === "message-room" ||
                  view === "details" ||
                  view === "calls") && <Conversations />}
              </div>
              {view !== "home" &&
                view !== "search" &&
                view !== "settings" &&
                view !== "calls" &&
                view !== "details" &&
                view !== "message-room" &&
                view !== "new" && <NotFound />}
            </div>
          </div>
          <div className="hidden h-screen w-full md:grid sticky inset-y-0 left-auto right-0">
            {(view === "home" ||
              view === "search" ||
              view === "settings" ||
              view === "new") && <DefaultView />}
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
      </PeerProvider>
    </Suspense>
  );
}
