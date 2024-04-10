import { useQuery } from "@tanstack/react-query";
import { Conversation, ConversationSkeleton } from "../conversation";
import { ConversationType } from "@/types";
import api from "@/api/axios";
import getId from "@/lib/utils";

export default function Conversations() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["all-conversations"],
    queryFn: async () => {
      const res = await api.get(`conversations?id=${getId()}`);
      return res.data.data;
    },
  });
  console.log(data);

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
  return (
    <>
      {data.map((conversation: ConversationType) => (
        <Conversation
          id={conversation.id}
          name={conversation.name}
          lastMessageTime={conversation.lastMessageTime}
          lastMessageType={conversation.lastMessageType}
          lastMessage={conversation.lastMessage}
          avatar={conversation.avatar}
          type={conversation.type}
          key={conversation.id}
        />
      ))}
    </>
  );
}
