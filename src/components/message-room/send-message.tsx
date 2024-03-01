import { useState } from "react";
import { MdAdd, MdSend } from "react-icons/md";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SendMessage() {
  const [message, setMessage] = useState("");

  function sendMessage() {
    setMessage("");
  }
  return (
    <form
      className="px-5 py-2 flex items-center absolute bottom-0 inset-x-0 bg-background"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MdAdd
            className={`w-8 h-8 p-1 rounded-full text-primary cursor-pointer hover:bg-secondary ${
              message.length < 1 ? "inline" : "hidden"
            }`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-36 mb-12 -ml-2 py-2">
          <DropdownMenuItem>Photos</DropdownMenuItem>
          <DropdownMenuItem>Videos</DropdownMenuItem>
          <DropdownMenuItem>Files</DropdownMenuItem>
          <DropdownMenuItem disabled>Audio</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Input
        type="text"
        value={message}
        placeholder="Write the message..."
        className={`ml-2 focus-visible:ring-0 ${message.length > 1 && "pr-9"}`}
        onChange={(e) => setMessage(e.target.value)}
      />
      <MdSend
        className={`w-5 h-5 -ml-7 text-primary cursor-pointer ${
          message.length > 0 ? "inline" : "hidden"
        }`}
        onClick={sendMessage}
      />
    </form>
  );
}
