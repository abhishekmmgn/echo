import { useCurrentConversation, useCurrentView } from "@/store";
import { MdChevronLeft } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatAvatarName } from "@/lib/formatting";

function DetailsHeader() {
  const { changeView } = useCurrentView();
  return (
    <div className="absolute inset-x-0 z-10 top-0 w-full h-14 text-muted-foreground flex items-center gap-5 px-5 bg-background border-b">
      <MdChevronLeft
        className="w-8 h-8 cursor-pointer hover:text-primary"
        onClick={() => changeView("message-room")}
      />
    </div>
  );
}

export default function Details() {
  const { name, avatar, conversationType } = useCurrentConversation();
  return (
    <div className="relative">
      <DetailsHeader />
      <div className="mt-14 flex flex-col items-center gap-1">
        <Avatar className="w-28 h-28 bg-secondary rounded-full sm:w-32 sm:h-32 text-5xl sm:text-6xl">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{formatAvatarName(name)}</AvatarFallback>
        </Avatar>
        <p className="text-center capitalize">{name}</p>
      </div>
    </div>
  );
}
