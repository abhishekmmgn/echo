import { useState, useEffect } from "react";
import { useCurrentConversation, useCurrentView } from "@/store";
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
import { formatAvatarName } from "@/lib/formatting";

export default function Calls() {
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [dailing, setDailing] = useState(true);

  // time tracking
  // calling

  const { name, avatar } = useCurrentConversation();
  const { changeView } = useCurrentView();

  function connectCall() {
    // connect the call
    setDailing(false); // after call gets connected
  }
  function endCall() {
    // end the call
    changeView("message-room");
  }
  function switchCall() {
    setCameraActive((prevCameraActiveState) => !prevCameraActiveState);
    // switch the call to audio/video
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
    connectCall();
  }, []);

  return (
    <div className="fixed inset-0 md:relative h-screen bg-secondary/5 flex flex-col justify-between items-center pt-12 pb-5">
      <div className="w-full max-w-lg flex flex-col items-center text-center gap-4">
        <Avatar className="w-28 h-28 bg-secondary rounded-full sm:w-32 sm:h-32 text-3xl sm:text-4xl">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{formatAvatarName(name)}</AvatarFallback>
        </Avatar>
        <h1 className="-mb-4 font-medium text-secondary-foreground text-3xl sm:text-4xl">
          {name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {dailing ? "Dailing" : cameraActive ? "Video Call" : "Audio Call"}
        </p>
      </div>
      <div className="w-full max-w-lg flex items-center justify-evenly">
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
          className="w-11 h-11 grid place-items-center bg-red-500 hover:bg-red-600 cursor-pointer rounded-full text-4xl"
          onClick={endCall}
        >
          <MdCallEnd />
        </span>
      </div>
    </div>
  );
}
