import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";
import NavbarWrapper, { SettingsNavbar } from "../navigation/navbar";
import Profile from "../settings/profile";

export default function Settings() {
  const { logout } = useAuth0();
  return (
    <>
      <NavbarWrapper height="64px">
        <SettingsNavbar />
      </NavbarWrapper>
      <div className="pt-16 md:pt-0">
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
        </div>
      </div>
    </>
  );
}