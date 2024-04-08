import { formatAvatarName, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { File } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Separator } from "./ui/separator";
import { saveAs } from "file-saver";

interface BubbleInterface {
  sender: "current" | "other";
  name: string;
  avatar: string | null;
  date: Date | string;
}
interface BubbleWrapperInterface extends BubbleInterface {
  type: "TEXT" | "FILE" | "IMAGE" | "CALL";
  fileUrl?: string;
  fileName?: string;
  children: React.ReactNode;
}

interface MessageBubbleInterface extends BubbleInterface {
  date: Date | string;
  message: string;
}

interface FileBubbleInterface extends MessageBubbleInterface {
  fileName: string;
}

function BubbleWrapper(props: BubbleWrapperInterface) {
  function deleteMessage() {}
  function downloadMessage() {
    saveAs(props.fileUrl!, props.fileName);
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={`w-full flex flex-col ${
            props.sender === "current" && "items-end"
          }`}
        >
          <div
            className={`flex ${
              props.sender === "other"
                ? "gap-2 items-end"
                : "w-full justify-end"
            }`}
          >
            {props.sender === "other" && (
              <Avatar className="h-9 w-9">
                <AvatarImage src={props.avatar || ""} alt={props.name} />
                <AvatarFallback className="text-xs+">
                  {formatAvatarName(props.name)}
                </AvatarFallback>
              </Avatar>
            )}
            {props.children}
          </div>
          <p className="mt-1 text-xs lg:text-xs+ pl-12 pr-2 text-muted-foreground">
            {formatDate(props.date)}
          </p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-32">
        {props.type !== "TEXT" && (
          <ContextMenuItem onClick={downloadMessage}>Download</ContextMenuItem>
        )}
        <Separator />
        <ContextMenuItem onClick={deleteMessage}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
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
    >
      <div
        className={`w-fit max-w-[60%] sm:max-w-[80%] lg:max-w-[60%] rounded-[var(--radius)] px-4 py-2 ${
          props.sender === "current"
            ? " bg-primary/80 text-primary-foreground"
            : "bg-secondary"
        }`}
      >
        <p>{props.message}</p>
      </div>
    </BubbleWrapper>
  );
}

export function ImageBubble(props: FileBubbleInterface) {
  return (
    <BubbleWrapper
      name={props.name}
      avatar={props.avatar}
      sender={props.sender}
      date={props.date}
      type="IMAGE"
      fileUrl={props.message}
      fileName={props.fileName}
    >
      <img
        src={props.message}
        alt={props.fileName}
        className="w-3/5 sm:w-1/2 md:w-3/5 lg:w-1/2 xl:w-[30%] bg-muted border-2 aspect-square rounded-[var(--radius)] object-cover"
      />
    </BubbleWrapper>
  );
}

export function FileBubble(props: FileBubbleInterface) {
  return (
    <BubbleWrapper
      name={props.name}
      avatar={props.avatar}
      sender={props.sender}
      date={props.date}
      type="FILE"
      fileUrl={props.message}
      fileName={props.fileName}
    >
      <div
        className={`w-fit max-w-[60%] sm:max-w-[80%] lg:max-w-[60%] h-10 rounded-[var(--radius)] secondary-foreground/80 flex items-center gap-2 px-3 ${
          props.sender === "current"
            ? " bg-primary/80 text-primary-foreground"
            : "bg-secondary"
        }`}
      >
        <File className="w-4 h-4" />
        <p>{props.message}</p>
      </div>
    </BubbleWrapper>
  );
}

export function DateDiv({ date }: { date: Date | string }) {
  return (
    <div className="w-full flex justify-center py-3">
      <small className="px-1 text-muted-foreground text-center">
        {formatDate(date)}
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
