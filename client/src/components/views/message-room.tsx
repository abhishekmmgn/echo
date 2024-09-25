import api from "@/api/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "@/lib/socket-provider";
import {
  formatAvatarName,
  getFileName,
  getId,
  noConversation,
} from "@/lib/utils";
import {
  useCurrentCall,
  useCurrentConversation,
  useCurrentView,
} from "@/store";
import { ConversationStateType, MessageType } from "@/types";
import { isAxiosError } from "axios";
import { File } from "lucide-react";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { MdAdd, MdSend } from "react-icons/md";
import { MdCall, MdChevronLeft } from "react-icons/md";
import { toast } from "sonner";
import {
  ActivityBubble,
  BubbleSkeleton,
  FileBubble,
  ImageBubble,
  TextBubble,
} from "../bubbles";
import CallNotification from "../call-notification";
import { Input } from "../ui/input";

export default function MessageRoom() {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(false);

  const { currentConversation, changeCurrentConversation } =
    useCurrentConversation();
  const { changeView } = useCurrentView();
  const { currentCall, changeCurrentCall } = useCurrentCall();

  const fetchConversation = async (url: string) => {
    try {
      const res = await api.get(url);
      const data = res?.data.data;
      return data;
    } catch (err) {
      console.log(err);
      if (isAxiosError(err) && err?.response?.status === 404) {
        console.log("New conversation");
      } else {
        toast("Error fetching conversation.");
      }
    }
  };

  async function getConversation() {
    try {
      const otherUserId = currentConversation.participants[0];
      const url = currentConversation.conversationId
        ? `/conversations/conversation?conversationId=${
            currentConversation.conversationId
          }&id=${getId()}`
        : `/conversations/conversation?otherUserId=${otherUserId}&id=${getId()}`;
      const data = await fetchConversation(url);

      if (data) {
        const newConversation: ConversationStateType = {
          ...currentConversation,
          conversationId: data.conversation.id,
          participants: data.conversation.participants,
          hasConversation:
            currentConversation.conversationType === "PRIVATE" ? true : null,
        };
        changeCurrentConversation(newConversation);
        const sortedMessages = data.messages.sort(
          (a: MessageType, b: MessageType) =>
            new Date(a.time).getTime() - new Date(b.time).getTime(),
        );
        setMessages(sortedMessages);
      }
    } catch (err) {
      if (isAxiosError(err) && err?.response?.status === 404) {
        console.log("E: ", err.code);
      } else {
        // toast("Error fetching conversation.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (
      currentConversation.conversationId ||
      currentConversation.hasConversation
    ) {
      getConversation();
    }
  }, [currentConversation.name]);

  useEffect(() => {
    socket.emit("join-room", currentConversation.conversationId);
    return () => {
      socket.emit("leave-room", currentConversation.conversationId);
      socket.off("join-room");
    };
  }, []);

  useEffect(() => {
    let activityTimeout: Timer;
    socket.on("show-message", (data: MessageType) => {
      setActivity(false);
      console.log(data);
      setMessages((prev) => [...prev, data]);
    });

    socket.on("show-activity", () => {
      setActivity(true);
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        setActivity(false);
      }, 1000);
    });

    return () => {
      socket.off("show-message");
      socket.off("show-activity");
    };
  }, []);

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activity]);

  function makeCall() {
    changeCurrentCall({
      ...currentCall,
      name: currentConversation.name,
      avatar: currentConversation.avatar,
      callType: currentConversation.conversationType,
      email: currentConversation.email,
    });
    changeView("calls");
  }
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
              src={currentConversation.avatar || ""}
              alt={currentConversation.name!}
            />
            <AvatarFallback>
              {formatAvatarName(currentConversation.name!)}
            </AvatarFallback>
          </Avatar>
          <p className="text-center text-sm capitalize">
            {currentConversation.name}
          </p>
        </div>
        {currentConversation.conversationType === "PRIVATE" ? (
          <MdCall className="w-6 h-6 cursor-pointer" onClick={makeCall} />
        ) : (
          <MdCall className="invisible" />
        )}
      </div>
      <div className="absolute inset-x-0 top-[90px] py-4 flex flex-col px-4 space-y-10 overflow-y-scroll bottom-11">
        <div className="sticky inset-x-0 -top-4 z-10 -mx-4">
          <CallNotification />
        </div>
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
      <SendMessage setMessages={setMessages} />
    </div>
  );
}

function SendMessage({
  setMessages,
}: {
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}) {
  const [messageType, setMessageType] = useState<
    "TEXT" | "IMAGE" | "FILE" | null
  >(null);
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileUploading, setFileUploading] = useState(false);

  const { socket } = useSocket();
  const { currentConversation, changeCurrentConversation } =
    useCurrentConversation();

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      console.log(file);

      const { getDownloadURL, ref, uploadBytes } = await import(
        "firebase/storage"
      );
      const { storage } = await import("@/lib/firebase-config");

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
            `${type.toLowerCase()}s/` + `---${file.name}---${Date.now()}`,
          );
          setFileUploading(true);
          setMessage("Uploading...");
          uploadBytes(itemRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              setFileUrl(downloadURL);
            });
            setMessage("Uploaded. Send now.");
          });
        } catch (error) {
          console.log(error);
          setMessage("Something went wrong while uploading file.");
        }
        setFileUploading(false);
      }
    },
    [],
  );

  const sendMessage = useCallback(async () => {
    if (fileUploading) {
      toast("File still uploading.");
      return;
    }
    if (
      currentConversation.conversationType === "PRIVATE" &&
      !currentConversation.hasConversation &&
      currentConversation.participants.length === 1 &&
      !currentConversation.conversationId
    ) {
      createPrivateConversation();
    } else {
      const res = await api.post(`/messages?id=${getId()}`, {
        conversationId: currentConversation.conversationId,
        content: fileUrl || message,
        messageType: messageType || "TEXT",
      });
      const data = res.data.data;
      console.log(data);
      socket.emit("send-message", {
        conversationId: currentConversation.conversationId,
        message: data,
      });
      setMessages((prev) => [...prev, data]);
      setFileUrl(null);
      setMessage("");
      setMessageType(null);
    }
  }, [message, fileUrl, messageType]);

  async function createPrivateConversation() {
    try {
      const res = await api.post(`/conversations?id=${getId()}`, {
        participants: currentConversation.participants,
        conversationType: "PRIVATE",
        content: fileUrl || message,
        messageType: messageType || "TEXT",
      });
      const data = res.data.data;

      const newConversation: ConversationStateType = {
        ...currentConversation,
        conversationId: data.conversation.id,
        hasConversation: true,
        conversationType: "PRIVATE",
      };
      changeCurrentConversation(newConversation);
      const messageToSend = {
        id: data.messages.id,
        content: data.messages.content,
        type: data.messages.type,
        name: newConversation.name!,
        avatar: newConversation.avatar!,
        time: data.messages.time,
        senderId: getId(),
      };
      setMessages((prev) => [...prev, messageToSend]);
      socket.emit("send-message", {
        conversationId: newConversation.conversationId,
        message: messageToSend,
      });
      setFileUrl(null);
      setMessage("");
      setMessageType(null);
    } catch (err) {
      console.log(err);
      toast("Error creating conversation.");
    }
  }

  function sendActivity(e: React.ChangeEvent<HTMLInputElement>) {
    setMessage(e.target.value);
    socket.emit("send-activity", currentConversation.conversationId);
  }

  return (
    <>
      {fileUrl && (
        <div className="h-24 border-t shadow-sm bg-background flex gap-2 absolute bottom-14 inset-x-0 px-5 pt-2">
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
          onChange={sendActivity}
        />
        <MdSend
          className={`w-5 h-5 -ml-7 text-primary cursor-pointer ${
            message.length > 0 ? "inline" : "hidden"
          }`}
          onClick={sendMessage}
        />
      </form>
    </>
  );
}
