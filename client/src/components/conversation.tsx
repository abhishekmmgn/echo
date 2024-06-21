import { useCurrentConversation, useCurrentView } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { formatAvatarName, formatDateTime, noConversation } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversationType } from "@/types";
import api from "@/api/axios";
import { useState } from "react";
import { toast } from "sonner";

export function Conversation(props: ConversationType) {
  const { currentConversation, changeCurrentConversation } =
    useCurrentConversation();
  const { changeView } = useCurrentView();
  const [deleted, setDeleted] = useState(false);

  const active: boolean = props.id === currentConversation.conversationId;
  async function deleteConversation() {
    if (props.id) {
      try {
        const res = await api.delete(`/conversations/${props.id}`);
        if (res.status === 200) {
          changeCurrentConversation(noConversation);
          changeView("home");
          setDeleted(true);
        }
      } catch (error) {
        console.log(error);
        toast("Something went wrong");
      }
    } else {
      console.log("No conversation id");
      toast("Something went wrong");
    }
  }
  if (deleted) {
    return <></>;
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onClick={() => {
            // changeCurrentConversation(noConversation);
            // changeView("calls");
            const curConv = {
              conversationId: props.id,
              name: props.name,
              avatar: props.avatar,
              email: null,
              participants: [],
              conversationType: props.type,
              hasConversation: null,
            };
            changeCurrentConversation(curConv);
            changeView("message-room");
          }}
          className={`w-full h-16 flex items-center hover:bg-muted/60 border-b px-4 gap-4 cursor-pointer ${
            active && "bg-muted/60"
          }`}
        >
          <Avatar className="h-11 w-11">
            <AvatarImage src={props.avatar || ""} alt={props.name} />
            <AvatarFallback>{formatAvatarName(props.name)}</AvatarFallback>
          </Avatar>
          <div className="h-full w-full flex flex-col justify-center gap-[2px]">
            <div className="w-full flex justify-between">
              <p className="line-clamp-1 font-medium max-w-[60%]">
                {props.name}
              </p>
              <p className="line-clamp-1 text-muted-foreground text-xs max-w-[40%]">
                {formatDateTime(props.lastMessageTime)}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="line-clamp-1 text-sm+ text-muted-foreground break-all max-w-[90%]">
                {props.lastMessageType === "TEXT"
                  ? props.lastMessage
                  : props.lastMessageType}
              </p>
              <p className="text-sm text-primary max-w-[10%]">
                {/* unread messages */}
              </p>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Mark as Read</ContextMenuItem>
        <ContextMenuItem onClick={deleteConversation}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function ConversationSkeleton() {
  return (
    <div className="w-full h-16 border-b border-muted/80 px-4 gap-4 flex items-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="w-[calc(100%-50px)] space-y-2">
        <div className="w-full flex justify-between">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-4 w-[250px]" />
      </div>
    </div>
  );
}
