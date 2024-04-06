import { Skeleton } from "@/components/ui/skeleton";

export function DefaultSkeleton() {
  return (
    <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}
