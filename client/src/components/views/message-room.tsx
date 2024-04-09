import {
  BlockedDiv,
  BubbleSkeleton,
  DateDiv,
  FileBubble,
  ImageBubble,
  TextBubble,
} from "../bubbles";
import { useEffect, useState } from "react";
import { MdAdd, MdSend } from "react-icons/md";
import { Input } from "../ui/input";
import { toast } from "sonner";
import api from "@/api/axios";
import getId, { formatAvatarName, noConversation } from "@/lib/utils";
import { useCurrentConversation, useCurrentView } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdCall, MdChevronLeft } from "react-icons/md";
import { ConversationStateType, MessageType } from "@/types";

export default function MessageRoom() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState<
    "TEXT" | "IMAGE" | "FILE" | null
  >(null);
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const { conversation, changeCurrentConversation } = useCurrentConversation();
  const { changeView } = useCurrentView();

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // console.log(file);
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
    if (
      conversation.conversationType === "PRIVATE" &&
      !conversation.hasConversation &&
      conversation.participants.length === 1 &&
      conversation.conversationId === null
    ) {
      createPrivateConversation();
    } else {
      // send put req.
    }
    setMessage("");
  }
  async function createPrivateConversation() {
    try {
      const res = await api.post(`/conversations?id=${getId()}`, {
        participants: conversation.participants,
        content: message,
        conversationType: "PRIVATE",
        messageType,
      });
      const data = res.data;
      // console.log(data);

      const newConversation: ConversationStateType = {
        ...conversation,
        conversationId: data.conversation.id,
        name: data.conversation.name,
        avatar: data.conversation.avatar,
        conversationType: "PRIVATE",
        hasConversation: true,
      };
      changeCurrentConversation(newConversation);
      // setMessages(

      // )
    } catch (err) {
      console.log(err);
      toast("Error creating conversation.");
    }
  }
  async function getConversation() {
    setLoading(true);
    try {
      let res;
      const otherUserId = conversation.participants[0];
      if (conversation.conversationId) {
        console.log("CI: ", conversation.conversationId);
        res = await api.get(
          `/conversations/conversation?conversationId=${
            conversation.conversationId
          }&id=${getId()}`
        );
      } else if (otherUserId) {
        // console.log("OU: ", otherUserId);
        res = await api.get(
          `/conversations/conversation?otherUserId=${otherUserId}&id=${getId()}`
        );
      }
      const data = res?.data.data;
      // console.log(data);
      const newConversation: ConversationStateType = {
        ...conversation,
        conversationId: data.conversation.id,
        name: data.conversation.name,
        avatar: data.conversation.avatar,
        hasConversation:
          conversation.conversationType === "PRIVATE" ? true : null,
      };
      changeCurrentConversation(newConversation);
      setMessages(data.messages);
    } catch (err) {
      console.log(err);
      toast("Error fetching conversation.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (conversation.conversationId || conversation.hasConversation) {
      getConversation();
    }
  }, []);
  // console.log("MR: ", conversation.conversationId);
  // This should run each time conversation is being changed

  return (
    <div className="w-full h-full">
      <div className="absolute inset-x-0 top-0 z-10 w-full h-[90px] text-muted-foreground flex items-center justify-between gap-5 px-4 bg-background border-b">
        <MdChevronLeft
          className="w-8 h-8 cursor-pointer"
          onClick={() => {
            changeCurrentConversation(noConversation);
            changeView("home");
          }}
        />
        <div
          onClick={() => changeView("details")}
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <Avatar className="h-11 w-11">
            <AvatarImage
              src={conversation.avatar || ""}
              alt={conversation.name!}
            />
            <AvatarFallback>
              {formatAvatarName(conversation.name!)}
            </AvatarFallback>
          </Avatar>
          <p className="text-center text-sm capitalize">{conversation.name}</p>
        </div>
        <MdCall
          className="w-6 h-6 cursor-pointer"
          onClick={() => changeView("calls")}
        />
      </div>
      <div
        className={`absolute inset-x-0 top-[90px] py-2 flex flex-col px-4 gap-2 overflow-y-scroll ${
          fileUrl ? "bottom-[140px]" : "bottom-11"
        }`}
      >
        {loading &&
          Array.from({ length: 11 }).map((_, idx) => (
            <BubbleSkeleton
              sender={idx % 2 !== 0 ? "current" : "other"}
              key={idx}
            />
          ))}
        {messages &&
          messages?.map((message: MessageType) => {
            if (message.type === "TEXT") {
              return (
                <TextBubble
                  sender={message.senderId === getId() ? "current" : "other"}
                  name={message.name}
                  avatar={message.avatar}
                  date={message.time}
                  message={message.content}
                  key={message.id}
                />
              );
            } else if (message.type === "IMAGE") {
              return (
                <ImageBubble
                  sender={message.senderId === getId() ? "current" : "other"}
                  name={message.name}
                  avatar={message.avatar}
                  date={message.time}
                  fileName=""
                  message={message.content}
                  key={message.id}
                />
              );
            } else if (message.type === "FILE") {
              return (
                <FileBubble
                  sender={message.senderId === getId() ? "current" : "other"}
                  name={message.name}
                  avatar={message.avatar}
                  date={message.time}
                  fileName=""
                  message={message.content}
                  key={message.id}
                />
              );
            }
          })}
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
            <MdAdd className="w-8 h-8 p-1 rounded-full cursor-pointer bg-background z-20" />
            <Input
              type="file"
              className="w-8 h-8 absolute top-0 right-0 bg-transparent"
              onChange={onFileChange}
            />
          </div>
        )}
        <Input
          type="text"
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
