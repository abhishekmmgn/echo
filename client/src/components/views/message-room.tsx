import {
  ActivityBubble,
  BubbleSkeleton,
  FileBubble,
  ImageBubble,
  TextBubble,
} from "../bubbles";
import { useEffect, useState, useRef, useCallback } from "react";
import { MdAdd, MdSend } from "react-icons/md";
import { Input } from "../ui/input";
import { toast } from "sonner";
import api from "@/api/axios";
import {
  getId,
  formatAvatarName,
  getFileName,
  noConversation,
  server,
} from "@/lib/utils";
import { useCurrentConversation, useCurrentView } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdCall, MdChevronLeft } from "react-icons/md";
import { ConversationStateType, MessageType } from "@/types";
import { storage } from "@/lib/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { File } from "lucide-react";
import { io } from "socket.io-client";
import { isAxiosError } from "axios";

const socket = io(server);
export default function MessageRoom() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState<
    "TEXT" | "IMAGE" | "FILE" | null
  >(null);
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [activity, setActivity] = useState(false);

  const { conversation, changeCurrentConversation } = useCurrentConversation();
  const { changeView } = useCurrentView();

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      if (file.size > 1024 * 1024 * 5) {
        toast("File size must be less than 5MB.");
        return;
      }
      try {
        setFileUrl(URL.createObjectURL(file));
        const type = file.type.includes("image") ? "IMAGE" : "FILE";
        setMessageType(type);
        const itemRef = ref(
          storage,
          `${type.toLowerCase()}s/` + `---${file.name}---${Date.now()}`
        );
        setFileUploading(true);
        setMessage("Uploading...");
        uploadBytes(itemRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setFileUrl(downloadURL);
          });
          toast("Uploaded!");
          setMessage("Uploaded. Send now.");
        });
      } catch (error) {
        console.log(error);
        setMessage("Something went wrong while uploading file.");
      }
      setFileUploading(false);
    }
  }, []);

  const sendMessage = useCallback(async () => {
    console.log("Sending message");
    if (fileUploading) {
      toast("File still uploading.");
      return;
    }
    if (
      conversation.conversationType === "PRIVATE" &&
      !conversation.hasConversation &&
      conversation.participants.length === 1 &&
      !conversation.conversationId
    ) {
      createPrivateConversation();
    } else {
      const res = await api.post(`/messages?id=${getId()}`, {
        conversationId: conversation.conversationId,
        content: fileUrl || message,
        messageType: messageType || "TEXT",
      });
      const data = res.data.data;
      console.log(data);
      socket.emit("message", data);
      setFileUrl(null);
      setMessage("");
      setMessageType(null);
    }
  }, [conversation, message, fileUrl, messageType]);

  async function createPrivateConversation() {
    try {
      const res = await api.post(`/conversations?id=${getId()}`, {
        participants: conversation.participants,
        conversationType: "PRIVATE",
        content: fileUrl || message,
        messageType: messageType || "TEXT",
      });
      const data = res.data;
      console.log(data);

      const newConversation: ConversationStateType = {
        ...conversation,
        conversationId: data.conversation.id,
        name: data.conversation.name,
        avatar: data.conversation.avatar,
        conversationType: "PRIVATE",
        hasConversation: true,
      };
      changeCurrentConversation(newConversation);
      socket.emit("newConversation", newConversation);
      setFileUrl(null);
      setMessage("");
      setMessageType(null);
    } catch (err) {
      console.log(err);
      toast("Error creating conversation.");
    }
  }
  const fetchConversation = async (url: string) => {
    try {
      const res = await api.get(url);
      const data = res?.data.data;
      return data;
    } catch (err) {
      console.log(err);
      if (isAxiosError(err) && err?.response?.status! === 404) {
        console.log("New conversation");
      } else {
        toast("Error fetching conversation.");
      }
    }
  };

  async function getConversation() {
    setLoading(true);
    try {
      const otherUserId = conversation.participants[0];
      const url = conversation.conversationId
        ? `/conversations/conversation?conversationId=${
            conversation.conversationId
          }&id=${getId()}`
        : `/conversations/conversation?otherUserId=${otherUserId}&id=${getId()}`;
      const data = await fetchConversation(url);

      if (data) {
        const newConversation: ConversationStateType = {
          ...conversation,
          conversationId: data.conversation.id,
          hasConversation:
            conversation.conversationType === "PRIVATE" ? true : null,
        };
        changeCurrentConversation(newConversation);
        const sortedMessages = data.messages.sort(
          (a: MessageType, b: MessageType) =>
            new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        setMessages(sortedMessages);
      }
    } catch (err) {
      if (isAxiosError(err) && err?.response?.status! === 404) {
        console.log("E: ", err.code);
        toast("Fuck");
      } else {
        // toast("Error fetching conversation.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (conversation.conversationId || conversation.hasConversation) {
      getConversation();
    }
  }, [conversation.name]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log(
        `Reconnected to socket server after ${attemptNumber} attempts`
      );
    });

    socket.on("message", (data: MessageType) => {
      setActivity(false);
      console.log(data);
      setMessages((prev) => [...prev, data]);
    });

    socket.on("activity", (data: string) => {
      console.log(data);
      setActivity(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  console.log("Room renders.");

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activity]);
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
        className={`absolute inset-x-0 top-[90px] py-4 flex flex-col px-4 space-y-10 overflow-y-scroll ${
          fileUrl ? "bottom-[120px]" : "bottom-11"
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
                  id={message.id}
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
                  message={message.content}
                  id={message.id}
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
                  message={message.content}
                  id={message.id}
                  key={message.id}
                />
              );
            }
          })}
        {activity && <ActivityBubble />}
        <div ref={lastMessageRef} />
      </div>
      {fileUrl && (
        <div className="h-24 bg-background flex gap-2 absolute bottom-14 inset-x-0 px-5 pt-1">
          {messageType === "IMAGE" ? (
            <img
              src={fileUrl}
              className={`h-20 aspect-auto rounded-sm ${
                fileUploading && "opacity-50"
              }`}
            />
          ) : (
            <div className="h-full flex items-end">
              <File className="w-20 h-20 text-secondary" />
              <p className="align-text-bottom">{getFileName(fileUrl)}</p>
            </div>
          )}
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
              className="w-8 h-8 absolute top-0 right-0 bg-transparent text-background"
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
          onChange={(e) => {
            setMessage(e.target.value);
            socket.emit("activity", `${conversation.conversationId} is typing`);
          }}
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
