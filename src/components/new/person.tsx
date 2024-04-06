import { formatAvatarName } from "@/lib/formatting";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { ContactType } from "@/types";

export default function Person(props: ContactType) {
  return (
    <div className="w-full h-16 flex items-center hover:bg-muted/60 border-b px-4 gap-4 cursor-pointer">
      <Avatar className="h-11 w-11">
        <AvatarImage src={props.avatar} alt={`${props.name}'s Avatar`} />
        <AvatarFallback>{formatAvatarName(props.name)}</AvatarFallback>
      </Avatar>
      <div className="h-full w-full flex flex-col justify-center">
        <p className="line-clamp-1 font-medium">{props.name}</p>
        <p className="line-clamp-1 text-sm+ text-muted-foreground">
          {props.username}
        </p>
      </div>
    </div>
  );
}

export function PersonSkeleton() {
  return (
    <div className="w-full h-16 border-b border-muted/80 px-4 gap-4 flex items-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
