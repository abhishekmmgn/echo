import { Button } from "../ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import echoLogo from "@/assets/echo-logo.png";

export default function Auth() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="h-screen py-10 px-4 flex flex-col sm:items-center sm:justify-center">
      <div className="h-full w-full rounded-[var(--radius)] flex flex-col items-center justify-between sm:p-10 sm:gap-20 lg:gap-28 xl:gap-32 sm:w-auto sm:h-auto">
        <div className="text-center">
          <img src={echoLogo} alt="App Icon" className="w-14 h-14 mx-auto" />
          <h1 className="mt-3 mb-1 text-3xl sm:text-4xl font-semibold">
            Sign In or Sign Up
          </h1>
          <p className="text-muted-foreground">
            Authenticate your account to get started.
          </p>
        </div>
        <div className="space-y-4 grid">
          <Button className="sm:max-w-md" onClick={() => loginWithRedirect()}>
            Continue
          </Button>
          <small className="text-center text-muted-foreground/70">
            By continuing you agree to our{" "}
            <span className="underline underline-offset-4">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="underline underline-offset-4">Privacy Policy</span>
          </small>
        </div>
      </div>
    </div>
  );
}
