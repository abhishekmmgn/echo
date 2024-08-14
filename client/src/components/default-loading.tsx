import { AiOutlineLoading3Quarters } from "react-icons/ai";

export function DefaultSkeleton() {
  const started = localStorage.getItem("coldStarted");
  return (
    <div className="h-screen w-screen flex justify-center items-center space-x-2 relative">
      <AiOutlineLoading3Quarters className="h-7 w-7 md:w-8 md:h-8 lg:w-9 lg:h-9 animate-spin" />
      {!started && (
        <small className="text-muted-foreground absolute right-5 bottom-5 md:right-8 md:bottom-8 selection:bg-background selection:text-muted-foreground text-sm md:text-sm+">
          It may take a while to load due to cold start.
        </small>
      )}
    </div>
  );
}
