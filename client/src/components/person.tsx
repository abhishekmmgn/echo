import getId, { formatAvatarName } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { ContactType, ConversationStateType } from "@/types";
import { useCurrentConversation, useCurrentView } from "@/store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import api from "@/api/axios";
import { useState } from "react";
import { toast } from "sonner";

export function Person(props: ContactType) {
  const { changeCurrentConversation } = useCurrentConversation();
  const { changeView } = useCurrentView();
  const [deleted, setDeleted] = useState(false);
  const [blocked, setBlocked] = useState(props.blocked);

  function openMessageRoom() {
    if (!blocked) {
      const newConversation: ConversationStateType = {
        conversationId: "",
        name: props.name,
        avatar: props.avatar,
        email: props.email,
        participants: [props.id],
        conversationType: "PRIVATE",
        hasConversation: props.hasConversation,
      };
      changeCurrentConversation(newConversation);
      changeView("message-room");
    }
  }
  async function handleBlock() {
    try {
      const res = await api.put(`/contacts/${props.id}?id=${getId()}`, {
        block: !blocked,
      });
      console.log(res.status);
      if (res.status === 200) {
        setBlocked(!blocked);
      }
    } catch (error) {
      console.log(error);
      toast("Someting went wrong");
    }
  }
  async function deleteContact() {
    if (props.id) {
      try {
        const res = await api.delete(`/contacts/${props.id}?id=${getId()}`);
        if (res.status === 200) {
          setDeleted(true);
        }
      } catch (error) {
        console.log(error);
        toast("Someting went wrong");
      }
    } else {
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
          className="w-full h-16 flex items-center hover:bg-muted/60 border-b px-4 gap-4 cursor-pointer"
          onClick={openMessageRoom}
        >
          <Avatar className="h-11 w-11">
            <AvatarImage
              src={props.avatar || ""}
              alt={`${props.name}'s Avatar`}
            />
            <AvatarFallback>{formatAvatarName(props.name)}</AvatarFallback>
          </Avatar>
          <div className="h-full w-full flex flex-col justify-center">
            <p className="line-clamp-1 font-medium">{props.name}</p>
            <p className="line-clamp-1 text-sm+ text-muted-foreground">
              {props.email}
            </p>
          </div>
          {blocked && (
            <div className="bg-secondary text-destructive text-sm py-1 px-2 rounded-sm">
              Blocked
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem
          onClick={handleBlock}
          className={`${!blocked && "text-destructive hover:text-destructive"}`}
        >
          {blocked ? "Unblock" : "Block"}
        </ContextMenuItem>
        <ContextMenuItem onClick={deleteContact}>
          Delete Contact
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function PersonSkeleton() {
  return (
    <div className="w-full h-16 border-b border-muted/80 px-4 gap-4 flex items-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
