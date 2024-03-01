import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";
import Profile from "../settings/profile";
import { ResponsiveDrawer } from "../responsive-drawer";

export default function Settings() {
  const { logout } = useAuth0();
  return (
    <>
      <Profile />
      <div className="px-5 py-2">
        <Button
          variant="secondary"
          className="sm:max-w-md"
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Logout
        </Button>
      <ResponsiveDrawer />
      </div>
    </>
  );
}
