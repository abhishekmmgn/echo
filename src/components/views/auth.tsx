import Header from "../navigation/header";
import { Button } from "../ui/button";
import appIcon from "../../../public/appIcon.png";
import { useAuth0 } from "@auth0/auth0-react";

export default function Auth() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="h-[calc(100vh-56px)] container">
      <Header title="Echo" />
      <div className="h-full flex flex-col justify-between items-center pb-6 md:justify-center md:gap-32 md:pt-0">
        <div className="flex flex-col items-center gap-2">
          <img
            src={appIcon}
            alt="Echo Logo"
            className="w-20 h-20 aspect-square bg-muted shadow-sm rounded-[var(--radius)] md:w-24 md:h-24"
          />
          <h1 className="text-3xl md:text-4xl font-semibold">
            Continue to Authenticate
          </h1>
        </div>
        <Button variant="secondary" className="sm:max-w-md" onClick={() => loginWithRedirect()}>
          Next
        </Button>
      </div>
    </div>
  );
}
