import { Button } from "../ui/button";

export default function NotFound() {
  return (
    <div className="grid place-items-center justify-center">
      <h1 className="">Nothing here.</h1>
      <Button variant="link" onClick={() => console.log("refresh")}>
        Refresh
      </Button>
    </div>
  );
}
