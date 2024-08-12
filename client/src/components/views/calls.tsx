import { useState, useEffect, useContext, useRef, useCallback } from "react";
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

  const sendStream = useCallback(async () => {
    if (stream) {
      for (const track of stream.getTracks()) {
        peer?.addTrack(track, stream);
      }
    }
  }, []);

  const getStream = useCallback(async () => {
    let newStream: MediaStream | null = null;
    if (screenSharing) {
      newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      // Capture the screen stream
      // const screenSteam = await navigator.mediaDevices.getDisplayMedia();
    } else {
      if (cameraActive) {
        newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
      } else {
        newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
      }
    }
    sendStream();
    setStream(newStream);
    streamRef.current = newStream;
  }, []);

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
      answer: RTCSessionDescriptionInit;
    }) {
      console.log("Accepted call: ", data);
      console.log("Signaling state: ", peer.signalingState);
      try {
        if (peer.signalingState === "have-local-offer") {
          await peer.setRemoteDescription(
            new RTCSessionDescription(data.answer)
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
          pendingRemoteDescription = data.answer;
        }
      } catch (error) {
        console.error("Error setting remote description:", error);
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

    socket.on("answered:call", offerAccepted);
    socket.on("declined:call", offerDeclined);

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
  }, [callStatus, remoteStream]);

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

  const handleTrackEvent = useCallback(
    (ev: RTCTrackEvent) => {
      if (!remoteStream) {
        const newRemoteStream = new MediaStream();
        newRemoteStream.addTrack(ev.track);
        console.log("Received remote track", ev.track);
        setRemoteStream(newRemoteStream);
      } else {
        // Add track to existing remote stream
        remoteStream.addTrack(ev.track);
        setRemoteStream(new MediaStream(remoteStream.getTracks())); // Update state to trigger re-render
      }
    },
    [remoteStream]
  );

  // set remote stream
  useEffect(() => {
    peer.addEventListener("track", handleTrackEvent);

    return () => {
      peer.removeEventListener("track", handleTrackEvent);
    };
  }, []);

  // console.log("---", currentCall.callId);
  console.log("S: ", stream, "RS: ", remoteStream);
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
            {callStatus === "ACTIVE" && (
              <p className="text-sm text-muted-foreground">
                {formatTime(time)}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-full max-w-sm sm:max-w-2xl rounded-[var(--radius)] relative">
        <div className="bg-secondary w-full h-auto aspect-[4/3] object-cover rounded-[var(--radius)]">
          {stream && (
            <ReactPlayer
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
          {remoteStream && (
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
          )}
        </div>
      </div>
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
