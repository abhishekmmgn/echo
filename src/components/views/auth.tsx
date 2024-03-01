import Header from "../navigation/header";
import { Button } from "../ui/button";
import { useAuth0 } from "@auth0/auth0-react";

export default function Auth() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="h-[calc(100vh-56px)] container">
      <Header title="Echo" />
      <div className="h-full flex flex-col items-center justify-between pb-6 md:justify-center md:gap-20 md:pt-0">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Sign In or Sign Up
        </h1>
        <div className="space-y-4 grid">
          <Button
            variant="secondary"
            className="sm:max-w-md"
            onClick={() => loginWithRedirect()}
          >
            Continue
          </Button>
          <small className="text-center">
            By continuing you agree to our{" "}
            <span className="underline underline-offset-2">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="underline underline-offset-2">Privacy Policy</span>
          </small>
        </div>
      </div>
    </div>
  );
}
