import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Person() {
  return (
    <div className="w-full h-16 flex items-center hover:bg-muted/60 border-b px-5 gap-4 cursor-pointer">
      <Avatar className="h-11 w-11">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="h-full w-full flex flex-col justify-center gap-[2px]">
        <p className="line-clamp-1 font-medium">Jake Denver</p>
        <p className="line-clamp-1 text-sm+ text-muted-foreground">
          Hey, meet me at the cafe.
        </p>
      </div>
    </div>
  );
}
