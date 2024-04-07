import { useQuery } from "@tanstack/react-query";
import { Conversation, ConversationSkeleton } from "../conversation";
import { ConversationType } from "@/types";
import axios from "axios";

export default function Conversations() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/user/hello");
      return res.data;
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
      {/* {(data as ConversationType[]).map(
        (item: ConversationType, idx: number) => (
          <Conversation
            name={item.name}
            date={item.date}
            message={item.message}
            unreadMessages={item.unreadMessages}
            avatar={item.avatar}
            type={item.type}
            id={item.id}
            key={idx}
          />
        )
      )} */}
    </>
  );
}
