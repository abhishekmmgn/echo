import { formatDate } from "@/lib/formatting";
import { File } from "lucide-react";

type PropsType = {
  date: Date | string;
  message: string;
  sender: "current" | "other";
};

export function TextBubble(props: PropsType) {
  return (
    <div
      className={`w-full flex flex-col gap-1 ${
        props.sender === "current" && "items-end"
      }`}
    >
      <div
        className={`w-fit max-w-[60%] rounded-[var(--radius)] px-4 py-2 ${
          props.sender === "current"
            ? " bg-primary/80 text-white"
            : "bg-secondary"
        }`}
      >
        <p>{props.message}</p>
      </div>
      <small className="px-2 text-muted-foreground">
        {formatDate(props.date)}
      </small>
    </div>
  );
}

export function ImageBubble(props: PropsType) {
  return (
    <div
      className={`w-full flex flex-col gap-1 ${
        props.sender === "current" && "items-end"
      }`}
    >
      <img
        src="https://www.nss-gehu.org/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2Fe262e1bb-7d8d-40ef-92e2-3e0357e47b1f-uayizh.webp&w=1920&q=100"
        alt=""
        className={`w-3/5 sm:w-1/2 md:w-3/5 lg:w-1/2 xl:w-[30%] bg-muted border-2 aspect-square rounded-[var(--radius)] object-cover ${
          props.sender === "current" ? " border-primary/60" : "border-secondary"
        }`}
      />
      <small className="px-2 text-muted-foreground">
        {formatDate(props.date)}
      </small>
    </div>
  );
}

export function VideoBubble(props: PropsType) {
  return (
    <div
      className={`w-full flex flex-col gap-1 ${
        props.sender === "current" && "items-end"
      }`}
    >
      <video
        src=""
        className={`w-3/5 sm:w-1/2 md:w-3/5 lg:w-1/2 xl:w-[30%] bg-muted border-2 aspect-[4/3] rounded-[var(--radius)] px-4 py-2 ${
          props.sender === "current" ? " border-primary/60" : "border-secondary"
        }`}
      />
      <small className="px-2 text-muted-foreground">
        {formatDate(props.date)}
      </small>
    </div>
  );
}

export function FileBubble(props: PropsType) {
  return (
    <div
      className={`w-full flex flex-col gap-1 ${
        props.sender === "current" && "items-end"
      }`}
    >
      <div
        className={`w-fit max-w-[60%] h-10 rounded-[var(--radius)] secondary-foreground/80 flex items-center gap-2 px-3
    ${props.sender === "current" ? " bg-primary/80" : "bg-secondary"}`}
      >
        <File className="w-4 h-4" />
        <p>{props.message}</p>
      </div>
      <small className="px-2 text-muted-foreground">
        {formatDate(props.date)}
      </small>
    </div>
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
