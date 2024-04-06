import { useState } from "react";
import { MdAdd, MdSend } from "react-icons/md";
import { Input } from "../ui/input";
import { toast } from "sonner";

export default function SendMessage() {
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

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

  const BLOCKED = true;
  return (
    <form
      className="px-4 py-2 flex items-center absolute bottom-0 inset-x-0 bg-background"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
    >
      <div className="relative">
        <MdAdd
          className={`w-8 h-8 p-1 rounded-full cursor-pointer ${
            message.length < 1 ? "inline" : "hidden"
          } ${BLOCKED && "text-muted-foreground"}`}
          />
        <Input
          type="file"
          disabled={BLOCKED}
          className="w-8 h-8 absolute z-10 top-0 right-0 bg-transprent"
          onChange={onFileChange}
        />
      </div>
      <Input
        type="text"
        disabled={BLOCKED}
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
