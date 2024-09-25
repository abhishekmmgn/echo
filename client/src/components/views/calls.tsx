import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PeerContext } from "@/lib/peer-provider";
import { useSocket } from "@/lib/socket-provider";
import { formatAvatarName, formatTime, getId, noCall } from "@/lib/utils";
import {
  useCurrentCall,
  useCurrentConversation,
  useCurrentUser,
  useCurrentView,
} from "@/store";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  MdCallEnd,
  MdMic,
  MdMicOff,
  MdScreenShare,
  MdStopScreenShare,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";
import ReactPlayer from "react-player";
import { toast } from "sonner";

export default function Calls() {
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [callStatus, setCallStatus] = useState<
    "DIALING" | "DECLINED" | "ACTIVE" | "ENDED"
  >("DIALING");

  const { socket } = useSocket();
  const { currentCall, changeCurrentCall } = useCurrentCall();
  const { changeView } = useCurrentView();
  const { currentConversation } = useCurrentConversation();
  const { currentUser } = useCurrentUser();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const pc = useContext(PeerContext);

  const getStream = useCallback(async () => {
    console.log("Geting stream...");
    let newStream: MediaStream | null = null;
    const constraints: DisplayMediaStreamOptions = {
      audio: micActive,
      video: cameraActive,
    };

    try {
      if (screenSharing) {
        newStream = await navigator.mediaDevices.getDisplayMedia(constraints);
      } else {
        newStream = await navigator.mediaDevices.getUserMedia(constraints);
      }
      setLocalStream(newStream);
    } catch (error) {
      // permission to access camera/mic denied
      if (
        error ===
        "The request is not allowed by the user agent or the platform in the current context."
      ) {
        toast("You've to provide mic and camera acess.");
      }
      console.log(error);
    }
  }, [cameraActive, micActive, screenSharing]);

  function endCall() {
    if (callStatus === "DIALING") {
      socket.emit("call:cancelled", currentConversation.conversationId);
    } else {
      // drop the rtc connection
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
  // offer status
  useEffect(() => {
    async function offerAccepted(data: {
      roomId: string;
      answer: RTCSessionDescriptionInit;
    }) {
      console.log("Accepted call: ", data);
      console.log("Signaling state: ", pc.signalingState);
      try {
        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          setCallStatus("ACTIVE");
        } else {
          console.log(
            "Peer connection not in stable state, queuing remote description. Current state:",
            pc.signalingState,
          );
          // pendingRemoteDescription = data.answer;
        }
      } catch (error) {
        console.error("In offerAccepted: ", error);
      }
    }

    function offerDeclined() {
      console.log("Declined call");
      setCallStatus("DECLINED");
      setTimeout(() => {
        changeCurrentCall(noCall);
        changeView("message-room");
      }, 1000);
    }

    socket.on("answered:call", offerAccepted);
    socket.on("declined:call", offerDeclined);

    return () => {
      socket.off("call:answered", offerAccepted);
      socket.off("call:declined", offerDeclined);
    };
  }, []);

  async function makeCall() {
    const localOffer = await pc.createOffer();
    console.log(`Local offer: ${localOffer}`);
    await pc.setLocalDescription(new RTCSessionDescription(localOffer));
    const call =
      currentConversation.conversationType === "PRIVATE"
        ? currentUser
        : currentConversation;
    const payload: {
      userId: string;
      avatar: string | null;
      name: string;
      offer: RTCSessionDescriptionInit;
      conversationId: string;
      participants: string[];
    } = {
      userId: getId(),
      avatar: call.avatar,
      name: call.name!,
      offer: localOffer,
      conversationId: currentConversation.conversationId!,
      participants: currentConversation.participants,
    };
    socket.emit("outgoing:call", payload);
  }
  async function answerCall() {
    // accept the offer and send back the answer
    console.log("Recieved Offer: ", currentCall.offer);
    await pc.setRemoteDescription(
      new RTCSessionDescription(currentCall.offer!),
    );

    console.log("--------------ANSWERING CALL----------------");
    // create answer
    const offerAnswer = await pc.createAnswer();
    await pc.setLocalDescription(new RTCSessionDescription(offerAnswer));

    console.log("------------", offerAnswer, "-------------------");
    socket.emit("call:accepted", {
      userId: getId(),
      roomId: currentCall.callId,
      answer: offerAnswer,
    });
  }

  // initial useEffect - make call or set state
  useEffect(() => {
    getStream();
    // add local tracks to peer connection
    localStream?.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    if (currentCall.offer) {
      // call has been recieved
      setCallStatus("ACTIVE");
      answerCall();
    } else {
      // user is the dialer
      makeCall();
    }
  }, []);

  useEffect(() => {
    pc.ontrack = async ({ streams: [stream] }) => {
      console.log(stream);
      setRemoteStream(stream);
    };
  }, [callStatus]);

  console.log(localStream, remoteStream);
  return (
    <div className="fixed inset-0 md:relative h-screen bg-secondary/5 flex flex-col justify-between items-center gap-5 p-5 px-4 sm:px-0">
      <div className="w-full max-w-sm sm:max-w-lg flex items-center justify-center+ gap-4">
        <Avatar className="w-20 h-20 bg-secondary rounded-full sm:w-24 sm:h-24 text-3xl sm:text-4xl">
          <AvatarImage src={currentCall.avatar || ""} alt={currentCall.name!} />
          <AvatarFallback>{formatAvatarName(currentCall.name!)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="font-medium text-secondary-foreground text-3xl sm:text-4xl">
            {currentCall.name}
          </h1>
          <div className="flex gap-2">
            <p className="text-sm text-muted-foreground">
              {callStatus !== "ACTIVE" && callStatus}
            </p>
            {callStatus === "ACTIVE" && <TimeTracker />}
          </div>
        </div>
      </div>

      <div className="w-full h-full max-w-sm sm:max-w-2xl relative">
        {localStream && (
          <div className="bg-secondary w-full h-auto aspect-[4/3] object-cover">
            <ReactPlayer
              playing
              url={localStream}
              height="100%"
              width="100%"
              style={{
                borderRadius: "12px",
              }}
            />
          </div>
        )}
        {remoteStream && (
          <div className="bg-muted absolute bottom-2 right-2 w-40 h-auto aspect-[4/3] object-cover sm:w-44 md:w-48 shadow-sm">
            <ReactPlayer
              url={remoteStream}
              playing
              muted={false}
              height="100%"
              width="100%"
              style={{
                borderRadius: "12px",
              }}
            />
          </div>
        )}
      </div>

      <div className="w-full max-w-sm sm:max-w-lg flex items-center justify-between lg:justify-between sm:justify-evenly">
        <span
          className={`w-12 h-12 grid place-items-center hover:bg-muted/70 cursor-pointer rounded-full text-4xl ${micActive ? "bg-secondary" : "bg-white hover:bg-white/70"}`}
          onClick={() => {
            setMicActive((prev) => !prev);
          }}
        >
          {micActive ? <MdMic /> : <MdMicOff className="text-secondary" />}
        </span>
        <span
          className={`w-12 h-12 grid place-items-center hover:bg-muted/70 cursor-pointer rounded-full text-4xl ${cameraActive ? "bg-secondary" : "bg-white hover:bg-white/70"}`}
          onClick={() => setCameraActive((prev) => !prev)}
        >
          {cameraActive ? (
            <MdVideocam />
          ) : (
            <MdVideocamOff className="text-secondary" />
          )}
        </span>
        <span
          className={`w-12 h-12 grid place-items-center hover:bg-muted/70 cursor-pointer rounded-full text-4xl ${!screenSharing ? "bg-secondary" : "bg-white hover:bg-white/70"}`}
          onClick={() => setScreenSharing((prev) => !prev)}
        >
          {screenSharing ? (
            <MdScreenShare className="text-secondary" />
          ) : (
            <MdStopScreenShare />
          )}
        </span>
        <span
          className="w-11 h-11 grid place-items-center bg-destructive hover:bg-destructive/70 cursor-pointer rounded-full text-4xl"
          onClick={endCall}
        >
          <MdCallEnd />
        </span>
      </div>
    </div>
  );
}

function TimeTracker() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  });
  return <p className="text-sm text-muted-foreground">{formatTime(time)}</p>;
}
