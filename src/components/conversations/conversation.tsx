import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";

export default function Conversation() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="w-full h-[60px] flex items-center hover:bg-muted/60 border-b px-5 gap-4 cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="h-full w-full flex flex-col justify-center">
            <div className="w-full flex justify-between">
              <p className="line-clamp-1 font-medium max-w-[60%]">Jake Denver</p>
              <p className="line-clamp-1 text-muted-foreground text-sm max-w-[40%]">
                12/12/2023
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="line-clamp-1 text-sm+ text-muted-foreground max-w-[90%]">
                Hey, meet me at the cafe.
              </p>
              <p className="text-sm text-primary max-w-[10%]">1</p>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Mark as Read</ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
        <ContextMenuItem>Hide</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
