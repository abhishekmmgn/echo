import { formatAvatarName, formatDate } from "@/lib/formatting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { File } from "lucide-react";

interface BubbleWrapperInterface {
  sender: "current" | "other";
  name: string;
  avatar: string;
  date: Date | string;
}

interface BubbleInterface extends BubbleWrapperInterface {
  date: Date | string;
  message: string;
}

function BubbleWrapper({
  name,
  sender,
  avatar,
  children,
  date,
}: BubbleWrapperInterface & { children: React.ReactNode }) {
  return (
    <div
      className={`w-full flex flex-col ${
        sender === "current" && "items-end"
      }`}
    >
      <div className={`flex ${sender === "other" ? "gap-2 items-end" : "w-full justify-end"}`}>
        {sender === "other" && (
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-xs+">
              {formatAvatarName(name)}
            </AvatarFallback>
          </Avatar>
        )}
        {children}
      </div>
      <p className="mt-1 text-xs lg:text-xs+ pl-12 pr-2 text-muted-foreground">
        {formatDate(date)}
      </p>
    </div>
  );
}

export function TextBubble(props: BubbleInterface) {
  return (
    <BubbleWrapper
      name={props.name}
      avatar={props.avatar}
      sender={props.sender}
      date={props.date}
    >
      <div
        className={`w-fit max-w-[60%] sm:max-w-[80%] lg:max-w-[60%] rounded-[var(--radius)] px-4 py-2 ${
          props.sender === "current"
            ? " bg-primary/80 text-white"
            : "bg-secondary"
        }`}
      >
        <p>{props.message}</p>
      </div>
    </BubbleWrapper>
  );
}

export function ImageBubble(props: BubbleInterface) {
  return (
    <BubbleWrapper
      name={props.name}
      avatar={props.avatar}
      sender={props.sender}
      date={props.date}
    >
      <img
        src="https://www.nss-gehu.org/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2Fe262e1bb-7d8d-40ef-92e2-3e0357e47b1f-uayizh.webp&w=1920&q=100"
        alt=""
        className="w-3/5 sm:w-1/2 md:w-3/5 lg:w-1/2 xl:w-[30%] bg-muted border-2 aspect-square rounded-[var(--radius)] object-cover"
      />
    </BubbleWrapper>
  );
}

export function FileBubble(props: BubbleInterface) {
  return (
    <BubbleWrapper
      name={props.name}
      avatar={props.avatar}
      sender={props.sender}
      date={props.date}
    >
      <div
        className={`w-fit max-w-[60%] sm:max-w-[80%] lg:max-w-[60%] h-10 rounded-[var(--radius)] secondary-foreground/80 flex items-center gap-2 px-3 ${
          props.sender === "current"
            ? " bg-primary/80 text-white"
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
