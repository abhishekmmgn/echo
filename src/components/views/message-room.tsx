import {
  DateDiv,
  FileBubble,
  ImageBubble,
  TextBubble,
  VideoBubble,
} from "../message-room/bubbles";
import MessageRoomHeader from "../message-room/message-room-header";
import SendMessage from "../message-room/send-message";

export default function MessageRoom() {
  return (
    <div className="w-full h-full md:relative">
      {/* on give date of last one else "" */}
      <MessageRoomHeader />
      <div className="absolute inset-x-0 inset-y-0 py-24 pb-16 bg-secondary/10 h-full flex flex-col px-5 gap-2 overflow-y-scroll">
        <ImageBubble
          date=""
          message="This is a test message."
          sender="current"
        />
        <TextBubble
          date=""
          message="This is a test message."
          sender="current"
        />
        <DateDiv date={new Date()} />
        <TextBubble date="" message="This is a test message." sender="other" />
        <VideoBubble date="" message="This is a test message." sender="other" />
        <FileBubble date={new Date()} message="somework.pdf" sender="other" />
      </div>
      <SendMessage />
    </div>
  );
}
