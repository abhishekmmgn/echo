import { useCurrentConversation, useCurrentView } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { formatAvatarName, formatDate } from "@/lib/formatting";
import { Skeleton } from "@/components/ui/skeleton";

type PropsType = {
  name: string;
  avatar: string;
  message: string;
  date: Date;
  unreadMessages: number;
  id: string;
  conversationType: "personal" | "group";
};
export default function Conversation(props: PropsType) {
  const { conversationId, changeCurrentConversation } =
    useCurrentConversation();
  const { changeView } = useCurrentView();
  const active: boolean = props.id === conversationId;
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onClick={() => {
            changeView("message-room");
            changeCurrentConversation(
              props.id,
              props.name,
              props.avatar,
              props.conversationType
            );
          }}
          className={`w-full h-16 flex items-center hover:bg-muted/60 border-b px-4 gap-4 cursor-pointer ${
            active && "bg-muted/60"
          }`}
        >
          <Avatar className="h-11 w-11">
            <AvatarImage src={props.avatar} alt={props.name} />
            <AvatarFallback>{formatAvatarName(props.name)}</AvatarFallback>
          </Avatar>
          <div className="h-full w-full flex flex-col justify-center gap-[2px]">
            <div className="w-full flex justify-between">
              <p className="line-clamp-1 font-medium max-w-[60%]">
                {props.name}
              </p>
              <p className="line-clamp-1 text-muted-foreground text-xs max-w-[40%]">
                {formatDate(props.date)}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="line-clamp-1 text-sm+ text-muted-foreground max-w-[90%]">
                {props.message}
              </p>
              <p className="text-sm text-primary max-w-[10%]">
                {props.unreadMessages}
              </p>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Mark as Read</ContextMenuItem>
        <ContextMenuItem className="text-destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function ConversationSkeleton() {
  return (
    <div className="w-full h-16 border-b border-muted/80 px-4 gap-4 flex items-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="w-full space-y-2">
        <div className="w-full flex justify-between">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-4 w-[250px]" />
      </div>
    </div>
  );
}
