import { useQuery } from "@tanstack/react-query";
import { Conversation, ConversationSkeleton } from "../conversation";
import { ConversationType } from "@/types";
import api from "@/api/axios";
import getId from "@/lib/utils";

export default function Conversations() {
  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ["all-conversations"],
  //   queryFn: async () => {
  //     const res = await api.get(`conversations?id=${getId()}`);
  //     return res.data;
  //   },
  // });
  // console.log(data);

  // if (isLoading) {
  //   return (
  //     <>
  //       {Array.from({ length: 10 }).map((_, idx) => (
  //         <ConversationSkeleton key={idx} />
  //       ))}
  //     </>
  //   );
  // } else if (isError) {
  //   console.log(error);
  //   return (
  //     <div className="h-[80vh] w-full grid place-items-center">
  //       <p className="text-destructive">Something went wrong.</p>
  //     </div>
  //   );
  // }
  // let avatar, name;
  // if (data && conversation.type === "PRIVATE") {
  //   const otherUser = conversation.participants.filter(
  //     (user) => user.id !== getId()
  //   );
  //   avatar = otherUser[0].avatar;
  //   name = otherUser[0].name;
  // }
  return (
    <>
      {/* {data.map((conversation) => (
        <Conversation
          id={conversation.id}
          name={conversation.type === "GROUP" ? conversation.name : name}
          date={conversation.createdAt}
          message={conversation.message}
          unreadMessages={conversation.unreadMessages}
          avatar={conversation.type === "GROUP" ? conversation.avatar : avatar}
          type={conversation.type}
          key={conversation.id}
        />
      ))} */}
    </>
  );
}
