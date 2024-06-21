import { useQuery } from "@tanstack/react-query";
import { Conversation, ConversationSkeleton } from "../conversation";
import { ConversationType } from "@/types";
import api from "@/api/axios";
import { getId } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSocket } from "@/lib/socket-provider";

export default function Conversations() {
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<ConversationType[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["all-conversations"],
    queryFn: async () => {
      const res = await api.get(`conversations?id=${getId()}`);
      return res.data.data;
    },
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (data) {
      setConversations(data);
    }
  }, [data]);
  useEffect(() => {
    socket.on(
      "newConversation",
      (data: {
        conversation: ConversationType;
        action: "CREATE" | "DELETE";
      }) => {
        console.log(data);
        if (data.action === "CREATE") {
          setConversations((prev) => [data.conversation, ...prev]);
        } else if (data.action === "DELETE") {
          setConversations((prev) =>
            prev.filter(
              (conversation) => conversation.id !== data.conversation.id
            )
          );
        }
      }
    );
  }, [socket]);

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 10 }).map((_, idx) => (
          <ConversationSkeleton key={idx} />
        ))}
      </>
    );
  } else if (isError) {
    console.log(error);
    return (
      <div className="h-[80vh] w-full grid place-items-center">
        <p className="text-destructive">Something went wrong.</p>
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className="h-[80vh] w-full grid place-items-center">
        <p>No conversations.</p>
      </div>
    );
  }
  return (
    <>
      {conversations.map((conversation: ConversationType) => (
        <Conversation
          id={conversation.id}
          name={conversation.name}
          lastMessageTime={conversation.lastMessageTime}
          lastMessageType={conversation.lastMessageType}
          lastMessage={conversation.lastMessage || "No messages yet"}
          avatar={conversation.avatar}
          type={conversation.type}
          key={conversation.id}
        />
      ))}
    </>
  );
}
