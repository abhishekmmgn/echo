import { Button } from "../ui/button";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-between py-20">
      <h1 className="text-center">Nothing here.</h1>
      <Button variant="link" onClick={() => window.location.reload()}>
        Refresh
      </Button>
    </div>
  );
}
