import { formatAvatarName, getId, noCall } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MdCallEnd } from "react-icons/md";
import { useCurrentCall, useCurrentView } from "@/store";
import { useSocket } from "@/lib/socket-provider";
import { useContext } from "react";
import { PeerContext } from "@/lib/peer-provider";

export default function CallNotification() {
  const { currentCall, changeCurrentCall } = useCurrentCall();
  const { socket } = useSocket();
  const { changeView } = useCurrentView();

  const peer = useContext(PeerContext);

  const answerCall = async () => {
    // accept the offer and send back the answer
    if (currentCall.offer) {
      console.log("Recieved Offer: ", currentCall.offer);
      await peer.setRemoteDescription(
        new RTCSessionDescription(currentCall.offer)
      );
    }

    // create answer
    const offerAnswer = await peer.createAnswer();
    await peer.setLocalDescription(new RTCSessionDescription(offerAnswer));

    socket.emit("call:accepted", {
      userId: getId(),
      roomId: currentCall.callId,
      answer: offerAnswer,
    });
    changeView("calls");
  };
  const declineCall = () => {
    // decline the offer and send back the re
    socket.emit("call:declined", {
      userId: getId(),
      roomId: currentCall.callId,
    });
    changeCurrentCall(noCall);
  };

  if (currentCall.callId) {
    return (
      <div className="h-[72px] w-full gap-5 px-4 bg-secondary border-b flex justify-between">
        <div className="flex items-center gap-4 w-full h-full">
          <Avatar className="h-[50px] w-[50px]">
            <AvatarImage
              src={currentCall.avatar || ""}
              alt={currentCall.name!}
            />
            <AvatarFallback className="text-lg">
              {formatAvatarName(currentCall.name!)}
            </AvatarFallback>
          </Avatar>
          <p className="font-medium text-lg lg:text-lg+ line-clamp-1">
            {currentCall.name}
          </p>
        </div>
        <div className="flex items-center justify-end gap-4 h-full">
          <span
            className="w-11 h-11 grid place-items-center bg-muted hover:bg-muted/80 cursor-pointer rounded-full text-4xl"
            onClick={answerCall}
          >
            <MdCallEnd className="text-primary -rotate-[135deg]" />
          </span>
          <span
            className="w-11 h-11 grid place-items-center bg-muted hover:bg-muted/80 cursor-pointer rounded-full text-4xl"
            onClick={declineCall}
          >
            <MdCallEnd className="text-destructive" />
          </span>
        </div>
      </div>
    );
  } else <></>;
}
