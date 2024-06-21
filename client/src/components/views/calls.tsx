import { useState, useEffect, useContext, useRef } from "react";
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
import { formatAvatarName, formatTime, getId, noCall } from "@/lib/utils";
import { PeerContext } from "@/lib/peer-provider";
import { useSocket } from "@/lib/socket-provider";
import ReactPlayer from "react-player";

export default function Calls() {
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [callStatus, setCallStatus] = useState<
    "DIALING" | "DECLINED" | "ACTIVE" | "ENDED"
  >("DIALING");
  const [time, setTime] = useState(0);

  const { socket } = useSocket();
  const { currentCall, changeCurrentCall } = useCurrentCall();
  const { changeView } = useCurrentView();
  const { currentConversation } = useCurrentConversation();
  const { currentUser } = useCurrentUser();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const peer = useContext(PeerContext);

  // console.log(peer);
  // time tracking
  // calling

  function endCall() {
    if (callStatus === "DIALING" && !currentCall.callId) {
      socket.emit("call:cancelled", currentConversation.conversationId);
    } else {
      //
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

  async function getStream() {
    if (screenSharing) {
      const newStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "browser",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      setStream(newStream);
      streamRef.current = newStream;
    } else {
      if (cameraActive) {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setStream(newStream);
        streamRef.current = newStream;
      } else {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setStream(newStream);
        streamRef.current = newStream;
      }
    }
  }

  function switchCall() {
    setScreenSharing(false);
    // switch the call to audio/video
    setCameraActive((prevCameraActiveState) => !prevCameraActiveState);
  }
  function shareScreen() {
    setCameraActive(false);
    setScreenSharing((prevScreenSharingState) => !prevScreenSharingState);
  }

  function changeMic() {
    setMicActive((prevMicState) => !prevMicState);
    // switch the call to audio/video
  }

  async function makeCall() {
    const localOffer = await peer.createOffer();
    await peer.setLocalDescription(new RTCSessionDescription(localOffer));

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

  // initial useEffect - make call or set state
  useEffect(() => {
    // join the call
    if (currentCall.callId && callStatus === "DIALING") {
      setCallStatus("ACTIVE");
    } else {
      // make call (create an offer and and send via socket)
      makeCall();
    }
  }, []);

  // offer status
  useEffect(() => {
    let pendingRemoteDescription: RTCSessionDescriptionInit | null = null;

    async function offerAccepted(data: {
      roomId: string;
      offer: RTCSessionDescriptionInit;
    }) {
      try {
        if (peer.signalingState === "stable") {
          await peer.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          if (!currentCall.callId) {
            setCallStatus("ACTIVE");
          } else {
            // other people joined
          }
        } else {
          console.log(
            "Peer connection not in stable state, queuing remote description. Current state:",
            peer.signalingState
          );
          pendingRemoteDescription = data.offer;
        }
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    }

    function offerDeclined() {
      setCallStatus("DECLINED");
      setTimeout(() => {
        changeCurrentCall(noCall);
        changeView("message-room");
      }, 1000);
    }

    function handleSignalingStateChange() {
      if (peer.signalingState === "stable" && pendingRemoteDescription) {
        peer
          .setRemoteDescription(
            new RTCSessionDescription(pendingRemoteDescription)
          )
          .then(() => {
            if (!currentCall.callId) {
              setCallStatus("ACTIVE");
            } else {
              // other people joined
            }
            pendingRemoteDescription = null;
          })
          .catch((error) => {
            console.error("Error setting queued remote description:", error);
          });
      }
    }

    peer.addEventListener("signalingstatechange", handleSignalingStateChange);

    socket.on("call:answered", offerAccepted);
    socket.on("call:declined", offerDeclined);

    return () => {
      peer.removeEventListener(
        "signalingstatechange",
        handleSignalingStateChange
      );
      socket.off("call:answered", offerAccepted);
      socket.off("call:declined", offerDeclined);
    };
  }, [currentCall.callId]);

  // call time
  useEffect(() => {
    const interval = setInterval(() => {
      if (callStatus === "ACTIVE") {
        setTime((prevTime) => prevTime + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [callStatus]);

  // set local stream
  useEffect(() => {
    getStream();
    if (stream) {
      for (const track of stream.getTracks()) {
        peer?.addTrack(track, stream);
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive, screenSharing]);

  // set remote stream
  useEffect(() => {
    function handleTrackEvent(ev: RTCTrackEvent) {
      const remoteStream = new MediaStream();
      remoteStream.addTrack(ev.track);
      console.log("Received remote track", ev.track);
      setRemoteStream(remoteStream);
    }

    peer.addEventListener("track", handleTrackEvent);

    return () => {
      peer.removeEventListener("track", handleTrackEvent);
    };
  }, []);

  console.log(remoteStream);
  return (
    <div className="fixed inset-0 md:relative h-screen bg-secondary/5 flex flex-col justify-between items-center gap-5 p-5 px-4 sm:px-0">
      {cameraActive || screenSharing ? (
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
              <p className="text-sm text-muted-foreground">
                {callStatus !== "ACTIVE" && callStatus}
              </p>
              {callStatus === "ACTIVE" && (
                <p className="text-sm text-muted-foreground">
                  {formatTime(time)}
                </p>
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
            <p className="text-sm text-muted-foreground">
              {callStatus !== "ACTIVE" && callStatus}
            </p>
            {callStatus === "ACTIVE" && (
              <p className="text-sm text-muted-foreground">
                {formatTime(time)}
              </p>
            )}
          </div>
        </div>
      )}
      {cameraActive && (
        <div className="w-full h-full max-w-sm sm:max-w-2xl rounded-[var(--radius)] relative">
          <div className="bg-secondary w-full h-auto aspect-[4/3] object-cover rounded-[var(--radius)]">
            {stream !== null && (
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
            )}
          </div>
          <div className="bg-muted absolute bottom-2 right-2 w-40 h-auto aspect-[4/3] object-cover rounded-[var(--radius)] sm:w-44 md:w-48 shadow-sm">
            {remoteStream !== null && (
              <ReactPlayer
                url={remoteStream}
                playing
                muted
                height="100%"
                width="100%"
                style={{
                  borderRadius: "12px",
                }}
              />
            )}
          </div>
        </div>
      )}
      <div
        className={`w-full max-w-sm sm:max-w-lg flex items-center justify-between lg:justify-between ${
          cameraActive || screenSharing ? "justify-evenly" : "sm:justify-evenly"
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
  );
}
