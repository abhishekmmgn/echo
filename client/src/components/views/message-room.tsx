import {
  BlockedDiv,
  DateDiv,
  FileBubble,
  ImageBubble,
  TextBubble,
} from "../bubbles";
import { useState } from "react";
import { MdAdd, MdSend } from "react-icons/md";
import { Input } from "../ui/input";
import { toast } from "sonner";

import { formatAvatarName } from "@/lib/formatting";
import { useCurrentConversation, useCurrentView } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdCall, MdChevronLeft } from "react-icons/md";

export default function MessageRoom() {
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const { name, avatar, changeCurrentConversation } = useCurrentConversation();
  const { changeView } = useCurrentView();

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      if (file.size > 1024 * 1024) {
        toast("File size must be less than 1MB.");
        return;
      }
      setFileUrl(URL.createObjectURL(file));
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      //upload file and seturl
      //   form.setValue("avatar", uploadUrl);
    }
  }

  function sendMessage() {
    setMessage("");
  }

  console.log(fileUrl)
  const BLOCKED = false;
  return (
    <div className="w-full h-full">
      <div className="absolute inset-x-0 top-0 z-10 w-full h-[90px] text-muted-foreground flex items-center justify-between gap-5 px-4 bg-background border-b">
        <MdChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => {
            changeCurrentConversation("", "", "", undefined);
            changeView("home");
          }}
        />
        <div
          onClick={() => changeView("details")}
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <Avatar className="h-11 w-11">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{formatAvatarName(name)}</AvatarFallback>
          </Avatar>
          <p className="text-center text-sm capitalize">{name}</p>
        </div>
        <MdCall
          className="w-6 h-6 cursor-pointer"
          onClick={() => changeView("calls")}
        />
      </div>
      <div className={`absolute inset-x-0 top-[90px] py-2 flex flex-col px-4 gap-2 overflow-y-scroll ${fileUrl ? "bottom-[140px]" : "bottom-11"}`}>
        <ImageBubble
          date={new Date()}
          message="This is a test message."
          sender="other"
          name="Jake Daniels"
          avatar=""
          fileName=""
          fileUrl=""
        />
        <TextBubble
          date=""
          message="This is a test message."
          sender="current"
          name="Jake"
          avatar=""
        />
        <TextBubble
          date=""
          message="This is a test message."
          sender="current"
          name="Jake"
          avatar=""
        />
        <TextBubble
          date=""
          message="This is a test message."
          sender="current"
          name="Jake"
          avatar=""
        />
        <TextBubble
          date=""
          message="This is a test message."
          sender="current"
          name="Jake"
          avatar=""
        />
        <DateDiv date={new Date()} />
        <TextBubble
          date=""
          message="This is a test message."
          sender="other"
          name="Jake"
          avatar=""
        />
        <FileBubble
          date={new Date()}
          message="somework.pdf"
          sender="current"
          name="Jake"
          avatar=""
          fileName=""
          fileUrl=""
        />
        <BlockedDiv />
      </div>
      {fileUrl && (
        <div className="h-24 flex gap-2 absolute bottom-[52px] inset-x-0 px-5 pt-2">
          <img src={fileUrl} className="h-20 w-20 rounded-sm" />
        </div>
      )}
      <form
        className="px-4 py-2 flex items-center absolute inset-x-0 bottom-0 bg-background"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            {!message && (
              <div className="relative">
                <MdAdd
                  className={`w-8 h-8 p-1 rounded-full cursor-pointer bg-background z-20 ${
                    BLOCKED && "text-muted-foreground"
                  }`}
                />
                <Input
                  type="file"
                  disabled={BLOCKED}
                  className="w-8 h-8 absolute top-0 right-0 bg-transparent"
                  onChange={onFileChange}
                />
              </div>
            )}
            <Input
              type="text"
              disabled={BLOCKED}
              value={message}
              placeholder="Write the message..."
              className={`ml-2 focus-visible:ring-0 ${
                message.length > 1 && "pr-9"
              }`}
              onChange={(e) => setMessage(e.target.value)}
            />
            <MdSend
              className={`w-5 h-5 -ml-7 text-primary cursor-pointer ${
                message.length > 0 ? "inline" : "hidden"
              }`}
              onClick={sendMessage}
            />
      </form>
    </div>
  );
}
