import { useState, useEffect } from "react";
import {
  useCurrentCall,
  useCurrentConversation,
  useCurrentUser,
  useCurrentView,
} from "@/store";
import {
  MdMicOff,
  MdCallEnd,
  MdMic,
  MdScreenShare,
  MdStopScreenShare,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatAvatarName, getId, noCall } from "@/lib/utils";
import { PeerProvider } from "@/lib/peer-provider";
import { useSocket } from "@/lib/socket-provider";
import ReactPlayer from "react-player";

export default function Calls() {
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [callStatus, setCallStatus] = useState<
    "DIALING" | "DECLINED" | "ACTIVE" | "ENDED"
  >("DIALING");

  const { socket } = useSocket();
  const { currentCall, changeCurrentCall } = useCurrentCall();
  const { changeView } = useCurrentView();
  const { currentConversation } = useCurrentConversation();
  const { currentUser } = useCurrentUser();

  // const { peer, createOffer } = useContext(PeerContext);

  // console.log(peer);
  // time tracking
  // calling

  function endCall() {
    if (callStatus === "DIALING" && !currentCall.callId) {
      socket.emit("call-cancelled", currentConversation.conversationId);
    } else {
      // do webrtc work here.
      // remove room if no one there.
      // else just leave the room
    }
    setCallStatus("ENDED");
    setTimeout(() => {
      if (currentConversation.conversationId) {
        changeView("message-room");
      } else {
        changeView("home");
      }
      changeCurrentCall(noCall);
    }, 1000);
  }

  useEffect(() => {
    async function getStream() {
      if (cameraActive) {
        setStream(
          await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          })
        );
      } else {
        setStream(
          await navigator.mediaDevices.getUserMedia({
            audio: true,
          })
        );
      }
    }
    getStream();
  }, [cameraActive]);

  function switchCall() {
    // switch the call to audio/video
    setCameraActive((prevCameraActiveState) => !prevCameraActiveState);
  }
  function shareScreen() {
    setScreenSharing((prevScreenSharingState) => !prevScreenSharingState);
    // switch the call to audio/video
  }

  function changeMic() {
    setMicActive((prevMicState) => !prevMicState);
    // switch the call to audio/video
  }

  useEffect(() => {
    function answerCall() {
      if (!currentCall.callId) {
        // first person joined

        setCallStatus("ACTIVE");
        // changeCurrentCall();
        // remove sockets if needed, etc. others people may join after call has started,
      } else {
        // other people joined
      }
    }

    if (currentCall.callId) {
      // join the call
      // socket.emit("join-calling-room", {
      //   userId: getId(),
      //   conversationId: currentConversation.conversationId,
      //   otherUserId: "3af9e72e-ef2a-46b9-88c1-7adec15e5fdc",
      // });
      // socket.on("end-dialing", () => {
      //   setDailing(false);
      // });
    } else {
      socket.emit("make-call", {
        userId: getId(),
        avatar:
          currentConversation.conversationType === "PRIVATE"
            ? currentUser.avatar
            : currentConversation.avatar,
        name:
          currentConversation.conversationType === "PRIVATE"
            ? currentUser.name
            : currentConversation.name,
        conversationId: currentConversation.conversationId,
        participants: currentConversation.participants,
      });
      socket.on("call-answered", answerCall);
    }
    return () => {
      socket.off("call-answered", answerCall);
    };
  }, []);

  useEffect(() => {
    function declineCall() {
      setCallStatus("DECLINED");
      setTimeout(() => {
        changeCurrentCall(noCall);
        changeView("message-room");
      }, 1000);
    }
    socket.on("call-declined", declineCall);
    return () => {
      socket.off("call-declined", declineCall);
    };
  });

  const time = "7sec";
  return (
    <PeerProvider>
      <div className="fixed inset-0 md:relative h-screen bg-secondary/5 flex flex-col justify-between items-center gap-5 p-5 px-4 sm:px-0">
        {cameraActive ? (
          <div className="w-full max-w-sm sm:max-w-lg flex items-center justify-center+ gap-4">
            <Avatar className="w-20 h-20 bg-secondary rounded-full sm:w-24 sm:h-24 text-3xl sm:text-4xl">
              <AvatarImage
                src={currentCall.avatar || ""}
                alt={currentCall.name!}
              />
              <AvatarFallback>
                {formatAvatarName(currentCall.name!)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="font-medium text-secondary-foreground text-3xl sm:text-4xl">
                {currentCall.name}
              </h1>
              <div className="flex gap-2">
                <p className="text-sm text-muted-foreground">{callStatus}</p>
                {callStatus === "ACTIVE" && (
                  <p className="text-sm text-muted-foreground"> · {time}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm sm:max-w-lg flex flex-col items-center text-center gap-4">
            <Avatar className="w-24 h-24 bg-secondary rounded-full sm:w-32 sm:h-32 text-3xl sm:text-4xl">
              <AvatarImage
                src={currentCall.avatar || ""}
                alt={currentCall.name!}
              />
              <AvatarFallback>
                {formatAvatarName(currentCall.name!)}
              </AvatarFallback>
            </Avatar>
            <h1 className="-mb-4 font-medium text-secondary-foreground text-3xl sm:text-4xl">
              {currentCall.name}
            </h1>
            <div className="flex gap-2">
              <p className="text-sm text-muted-foreground">{callStatus}</p>
              {callStatus == "ACTIVE" && (
                <p className="text-sm text-muted-foreground"> · {time}</p>
              )}
            </div>
          </div>
        )}
        {cameraActive && (
          <div className="w-full h-full max-w-sm sm:max-w-2xl rounded-[var(--radius)] relative">
            <div className="bg-secondary w-full h-auto aspect-[4/3] object-cover rounded-[var(--radius)]">
              <ReactPlayer
                muted
                playing
                url={stream}
                height="100%"
                width="100%"
                style={{
                  borderRadius: "12px",
                }}
              />
            </div>
            <div className="bg-muted absolute bottom-2 right-2 w-40 h-auto aspect-[4/3] object-cover rounded-[var(--radius)] sm:w-44 md:w-48 shadow-sm">
              <ReactPlayer
                url={stream}
                playing
                muted
                height="100%"
                width="100%"
                style={{
                  borderRadius: "12px",
                }}
              />
            </div>
          </div>
        )}
        <div
          className={`w-full max-w-sm sm:max-w-lg flex items-center justify-between lg:justify-between ${
            cameraActive ? "justify-evenly" : "sm:justify-evenly"
          }`}
        >
          <span
            className="w-12 h-12 grid place-items-center bg-secondary hover:bg-muted/70 cursor-pointer rounded-full text-4xl"
            onClick={changeMic}
          >
            {micActive ? <MdMic /> : <MdMicOff />}
          </span>
          <span
            className="w-12 h-12 grid place-items-center bg-secondary hover:bg-muted/70 cursor-pointer rounded-full text-4xl"
            onClick={switchCall}
          >
            {cameraActive ? <MdVideocam /> : <MdVideocamOff />}
          </span>
          <span
            className="w-12 h-12 grid place-items-center bg-secondary hover:bg-muted/70 cursor-pointer rounded-full text-4xl"
            onClick={shareScreen}
          >
            {screenSharing ? <MdScreenShare /> : <MdStopScreenShare />}
          </span>
          <span
            className="w-11 h-11 grid place-items-center bg-destructive hover:bg-destructive/70 cursor-pointer rounded-full text-4xl"
            onClick={endCall}
          >
            <MdCallEnd />
          </span>
        </div>
      </div>
    </PeerProvider>
  );
}
