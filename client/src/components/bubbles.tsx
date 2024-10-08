import api from "@/api/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  formatAvatarName,
  formatDateTime,
  getFileName,
  getId,
} from "@/lib/utils";
import { useCurrentConversation } from "@/store";
import { saveAs } from "file-saver";
import { File } from "lucide-react";
import { useState } from "react";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

interface BubbleInterface {
  sender: "current" | "other";
  name: string;
  avatar: string | null;
  date: string;
  id: string;
}
interface BubbleWrapperInterface extends BubbleInterface {
  type: "TEXT" | "FILE" | "IMAGE" | "CALL";
  fileUrl?: string;
  children: React.ReactNode;
}

interface MessageBubbleInterface extends BubbleInterface {
  date: string;
  message: string;
}

function BubbleWrapper(props: BubbleWrapperInterface) {
  const [deleted, setDeleted] = useState(false);
  const { currentConversation } = useCurrentConversation();
  async function deleteMessage() {
    const res = await api.delete(`/messages/${props.id}?id=${getId()}`);
    const data = res.data.data;
    console.log(data);
    setDeleted(true);
  }
  async function downloadMessage() {
    if (props.fileUrl) {
      saveAs(props.fileUrl, getFileName(props.fileUrl));
    }
  }

  if (deleted) {
    return <></>;
  }
  return (
    <div
      className={`w-full flex flex-col ${
        props.sender === "current" && "items-end"
      }`}
    >
      <div
        className={`flex ${
          props.sender === "other" ? "gap-2 items-end" : "w-full justify-end"
        }`}
      >
        {props.sender === "other" &&
          currentConversation.conversationType === "GROUP" && (
            <Avatar className="h-9 w-9">
              <AvatarImage src={props.avatar || ""} alt={props.name} />
              <AvatarFallback className="text-xs+">
                {formatAvatarName(props.name)}
              </AvatarFallback>
            </Avatar>
          )}
        <div className="-mb-5 flex flex-col gap-[6px] items-end">
          {props.sender === "other" &&
            currentConversation.conversationType === "GROUP" && (
              <div className="w-full">
                <p className="text-xs lg:text-xs+ text-muted-foreground">
                  {props.name}
                </p>
              </div>
            )}
          <ContextMenu>
            <ContextMenuTrigger className="w-full">
              {props.children}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-32">
              {props.type !== "TEXT" && (
                <ContextMenuItem
                  className="text-primary"
                  onClick={downloadMessage}
                >
                  Download
                </ContextMenuItem>
              )}
              <Separator />
              <ContextMenuItem
                className="text-destructive"
                onClick={deleteMessage}
              >
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <p className=" text-xs lg:text-xs+ text-muted-foreground">
            {formatDateTime(props.date)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TextBubble(props: MessageBubbleInterface) {
  return (
    <BubbleWrapper
      name={props.name}
      avatar={props.avatar}
      sender={props.sender}
      date={props.date}
      type="TEXT"
      id={props.id}
    >
      <div
        className={`max-w-60 sm:max-w-md rounded-[var(--radius)] px-4 py-2 ${
          props.sender === "current"
            ? " bg-primary/80 text-primary-foreground"
            : "bg-secondary"
        }`}
      >
        <p className="break-words">{props.message}</p>
      </div>
    </BubbleWrapper>
  );
}
export function ImageBubble(props: MessageBubbleInterface) {
  return (
    <BubbleWrapper
      name={props.name}
      avatar={props.avatar}
      sender={props.sender}
      date={props.date}
      type="IMAGE"
      fileUrl={props.message}
      id={props.id}
    >
      <img
        src={props.message}
        alt={getFileName(props.message)}
        loading="lazy"
        className="w-64 sm:w-80 bg-muted border-2 aspect-square rounded-[var(--radius)] object-cover"
      />
    </BubbleWrapper>
  );
}

export function FileBubble(props: MessageBubbleInterface) {
  return (
    <BubbleWrapper
      name={props.name}
      avatar={props.avatar}
      sender={props.sender}
      date={props.date}
      fileUrl={props.message}
      type="FILE"
      id={props.id}
    >
      <div
        className={`flex flex-col ${props.sender === "current" && "items-end"}`}
      >
        <File
          className={`w-20 h-20 ${
            props.sender === "current"
              ? "scale-x-[-1] text-primary/80"
              : "text-secondary"
          }`}
        />
        <p
          className={`w-40 text-sm break-all  ${
            props.sender === "current" && "text-right"
          }`}
        >
          {getFileName(props.message)}
        </p>
      </div>
    </BubbleWrapper>
  );
}

export function DateDiv({ date }: { date: string }) {
  return (
    <div className="w-full flex justify-center py-3">
      <small className="px-1 text-muted-foreground text-center">
        {formatDateTime(date)}
      </small>
    </div>
  );
}

export function BlockedDiv() {
  return (
    <div className="w-full flex justify-center py-3">
      <small className="px-1 text-destructive text-center">
        You've blocked the contact.
      </small>
    </div>
  );
}

export function BubbleSkeleton({ sender }: { sender: "current" | "other" }) {
  return (
    <div
      className={`w-full flex flex-col ${sender === "current" && "items-end"}`}
    >
      <div
        className={`flex ${
          sender === "other" ? "gap-2 items-end" : "w-full justify-end"
        }`}
      >
        {sender === "other" && <Skeleton className="rounded-full h-9 w-9" />}
        <div
          className={`max-w-md ${sender === "current" && "flex justify-end"}`}
        >
          {sender === "other" && (
            <Skeleton className="mb-1 w-12 h-3 lg:text-xs+ pl-12" />
          )}
          <Skeleton className="h-10 w-56 max-w-[60%] sm:max-w-[80%] lg:max-w-[60%] px-4 py-2" />
        </div>
      </div>
    </div>
  );
}

export function ActivityBubble() {
  return (
    <div className="w-20 aspect-square rounded-[var(--radius)] py-2 flex items-center justify-center gap-1">
      <Skeleton className="w-3 h-3" />
      <Skeleton className="w-3 h-3" />
      <Skeleton className="w-3 h-3" />
    </div>
  );
}
