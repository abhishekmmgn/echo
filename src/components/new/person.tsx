import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Person() {
  return (
    <div className="w-full h-14 flex items-center hover:bg-muted/60 border-b px-5 gap-4 cursor-pointer">
      <Avatar className="h-9 w-9">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="w-full flex flex-col">
        <p className="line-clamp-1">Jake Denver</p>
        <p className="line-clamp-1 text-muted-foreground text-sm">Bio</p>
      </div>
    </div>
  );
}
