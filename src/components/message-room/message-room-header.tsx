import { formatAvatarName } from "@/lib/formatting";
import { useCurrentConversation, useCurrentView } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdCall, MdChevronLeft } from "react-icons/md";

export default function MessageRoomHeader() {
  const { name, avatar, changeCurrentConversation } = useCurrentConversation();
  const { changeView } = useCurrentView();
  return (
    <div className="absolute inset-x-0 z-10 top-0 w-full h-[84px] text-muted-foreground flex items-center justify-between gap-5 px-5 bg-background border-b">
      <MdChevronLeft
        className="w-8 h-8 cursor-pointer hover:text-primary"
        onClick={() => {
          changeCurrentConversation("", "", "");
          changeView("home");
        }}
      />
      <div
        onClick={() => changeView("details")}
        className="flex flex-col items-center gap-1 cursor-pointer"
      >
        <Avatar className="h-11 w-11">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{formatAvatarName(name)}</AvatarFallback>
        </Avatar>
        <p className="text-center text-sm capitalize hover:text-primary">
          {name}
        </p>
      </div>
      <MdCall
        className="w-6 h-6 cursor-pointer hover:text-primary"
        onClick={() => changeView("calls")}
      />
    </div>
  );
}
