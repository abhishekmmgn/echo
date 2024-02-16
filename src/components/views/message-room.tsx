import { MdSend } from "react-icons/md";
import { Input } from "../ui/input";
import { useState } from "react";

export default function MessageRoom() {
  const [message, setMessage] = useState("");
  return (
    <div>
      <div className="px-5 py-2 flex items-center">
        <Input
          type="text"
          placeholder="Type a message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <MdSend
          className={`w-5 h-5 -ml-7 text-primary cursor-pointer ${
            message.length > 0 ? "inline" : "hidden"
          }`}
          onClick={() => console.log("Works.")}
        />
      </div>
    </div>
  );
}
