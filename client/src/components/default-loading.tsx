import { AiOutlineLoading3Quarters } from "react-icons/ai";

export function DefaultSkeleton() {
  return (
    <div className="flex items-center space-x-2">
      <AiOutlineLoading3Quarters className="h-7 w-7 md:w-8 md:h-8 lg:w-9 lg:h-9 animate-spin" />
    </div>
  );
}
